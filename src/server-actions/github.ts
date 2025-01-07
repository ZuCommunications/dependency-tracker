'use server'

import { ActionOptions } from '@/hooks/useFetchActionsData'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GH_ACCESS_TOKEN,
})

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER!

// Environment mapping configuration
const ENV_MAPPING = {
  development: ['dev', 'local', 'development'] as const,
  staging: ['beta', 'uat', 'staging', 'testing', 'test'] as const,
  production: ['prod', 'production', 'live'] as const,
} as const

type EnvType = typeof ENV_MAPPING
type DevEnv = EnvType['development'][number]
type StagingEnv = EnvType['staging'][number]
type ProdEnv = EnvType['production'][number]
type ValidEnv = DevEnv | StagingEnv | ProdEnv

// Helper to normalize environment names
function normalizeEnvironment(env: string): 'dev' | 'beta' | 'prod' | null {
  const envLower = env.toLowerCase() as ValidEnv
  if (ENV_MAPPING.development.includes(envLower as DevEnv)) return 'dev'
  if (ENV_MAPPING.staging.includes(envLower as StagingEnv)) return 'beta'
  if (ENV_MAPPING.production.includes(envLower as ProdEnv)) return 'prod'
  return null
}

export async function fetchRepos() {
  const response = await octokit.repos.listForOrg({
    org: owner,
    per_page: 200,
    sort: 'full_name',
  })
  return response.data
}

export async function fetchDependabotAlertsData(
  repoName: string,
  severity?: string,
) {
  try {
    const response = await octokit.dependabot.listAlertsForRepo({
      owner,
      repo: repoName,
      severity: severity,
      state: 'open',
    })
    return response.data
  } catch (error) {
    console.error('Error fetching Dependabot alerts:', error)
    return []
  }
}

export async function fetchActionsData(options: ActionOptions) {
  const response = await octokit.actions.listWorkflowRunsForRepo({
    owner,
    repo: options.repoName,
    status: options.filter,
  })
  return response.data
}

export async function fetchDeploymentStatus(repoName: string) {
  try {
    // Fetch deployments for all possible environments
    const allEnvs = Object.values(ENV_MAPPING).flat()
    const deploymentsPromises = allEnvs.map((env) =>
      octokit.repos.listDeployments({
        owner,
        repo: repoName,
        environment: env,
        per_page: 5,
      }),
    )
    const deploymentResponses = await Promise.all(deploymentsPromises)
    const allDeployments = deploymentResponses.flatMap(
      (response) => response.data,
    )

    // Early return if no deployments
    if (allDeployments.length === 0) {
      return { dev: null, beta: null, prod: null }
    }

    // Fetch releases in parallel with deployments
    const releasesResponse = await octokit.repos.listReleases({
      owner,
      repo: repoName,
      per_page: 100,
    })
    const releases = releasesResponse.data

    // Fetch all deployment statuses in parallel
    const statusesPromises = allDeployments.map((deployment) =>
      octokit.repos.listDeploymentStatuses({
        owner,
        repo: repoName,
        deployment_id: deployment.id,
        per_page: 1,
      }),
    )
    const statusesResponses = await Promise.all(statusesPromises)

    // Filter to only successful deployments and prepare commit fetching
    const successfulDeployments = allDeployments.filter(
      (deployment, index) =>
        statusesResponses[index].data[0]?.state === 'success',
    )

    // Fetch all required commits in a single batch
    const uniqueCommits = [...new Set(successfulDeployments.map((d) => d.sha))]
    const commitsPromises = uniqueCommits.map((sha) =>
      octokit.repos.getCommit({
        owner,
        repo: repoName,
        ref: sha,
      }),
    )
    const commitsResponses = await Promise.all(commitsPromises)

    // Create a map of commit data for quick lookup
    const commitDataMap = new Map(
      commitsResponses.map((response, index) => [
        uniqueCommits[index],
        {
          sha: uniqueCommits[index],
          parents: response.data.parents.map((p) => p.sha),
        },
      ]),
    )

    // Process deployments with all data available
    const processedDeployments = successfulDeployments
      .map((deployment, index) => {
        const status = statusesResponses[index].data[0]
        const commitData = commitDataMap.get(deployment.sha)
        const normalizedEnv = normalizeEnvironment(deployment.environment)

        if (!status || !commitData || !normalizedEnv) return null

        // Find matching release
        const commitShas = [deployment.sha, ...commitData.parents]
        const matchingRelease = releases.find((release) =>
          commitShas.includes(release.target_commitish),
        )

        return {
          environment: normalizedEnv,
          originalEnvironment: deployment.environment,
          status: 'success',
          created_at: deployment.created_at,
          url: status.target_url,
          ref: deployment.ref,
          sha: deployment.sha.substring(0, 7),
          commitUrl: `https://github.com/${owner}/${repoName}/commit/${deployment.sha}`,
          refUrl: `https://github.com/${owner}/${repoName}/tree/${deployment.ref}`,
          actor: deployment.creator
            ? {
                login: deployment.creator.login,
                avatar_url: deployment.creator.avatar_url,
                html_url: deployment.creator.html_url,
              }
            : null,
          release: matchingRelease
            ? {
                name: matchingRelease.name,
                tag: matchingRelease.tag_name,
                url: matchingRelease.html_url,
              }
            : null,
        }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)

    // Group by environment and get latest for each
    const latestDeployments = new Map()
    processedDeployments.forEach((deployment) => {
      const current = latestDeployments.get(deployment.environment)
      if (
        !current ||
        new Date(deployment.created_at) > new Date(current.created_at)
      ) {
        latestDeployments.set(deployment.environment, deployment)
      }
    })

    return {
      dev: latestDeployments.get('dev') || null,
      beta: latestDeployments.get('beta') || null,
      prod: latestDeployments.get('prod') || null,
    }
  } catch (error) {
    console.error('Error fetching deployment status:', error)
    return {
      dev: null,
      beta: null,
      prod: null,
    }
  }
}
