import RepositoryActions from './RepositoryActions'

export default async function ActionsForRepo(props: {
  params: Promise<{ repoName: string }>
}) {
  const params = await props.params
  const { repoName } = params

  return <RepositoryActions repoName={repoName} />
}
