import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface VersionData {
  [key: string]: string
}

function getActualTechAndVersion(
  tech: string,
  version: string,
): { actualTech: string; actualVersion: string } {
  let actualTech = tech
  let actualVersion = version

  if (tech === 'nodejs') {
    const ltsMap: Record<string, string> = {
      'lts/jod': '22',
      'lts/iron': '20',
      'lts/hydrogen': '18',
      'lts/gallium': '16',
      'lts/fermium': '14',
      'lts/erbium': '12',
      'lts/dubnium': '10',
    }
    actualVersion = ltsMap[version.toLowerCase()] || version
  } else if (tech === 'db') {
    actualTech = version.toLowerCase().includes('mariadb') ? 'mariadb' : 'mysql'
  } else if (tech === 'os') {
    if (version.startsWith('CentOS')) {
      actualTech = 'centos'
      actualVersion = version.replace(/[^\d.]/g, '').trim()
    } else if (version.startsWith('Rocky')) {
      actualTech = 'rocky-linux'
      actualVersion = version.replace(/[^\d.]/g, '').trim()
    } else if (version.startsWith('Red Hat')) {
      actualTech = 'rhel'
      actualVersion = version.replace(/[^\d.]/g, '').trim()
    }
  }

  return { actualTech, actualVersion }
}

export async function fetchVersionData(
  tech: string,
  version: string,
): Promise<VersionData> {
  const { actualTech, actualVersion } = getActualTechAndVersion(tech, version)

  async function fetchDataForSpecificVersion(
    versionToFetch: string,
  ): Promise<VersionData | null> {
    const url = `https://endoflife.date/api/${actualTech}/${versionToFetch}.json`
    try {
      const { data } = await axios.get<VersionData>(url)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw new Error('Failed to fetch EOL data')
    }
  }

  let versionToTry = actualVersion
  let data: VersionData | null = null

  while (versionToTry) {
    data = await fetchDataForSpecificVersion(versionToTry)
    if (data) break

    const versionParts = versionToTry.split('.')
    versionParts.pop()
    versionToTry = versionParts.join('.')
  }

  if (!data) throw new Error('Failed to fetch version data')

  return { Tech: actualTech, Showing_Info_For_Version: versionToTry, ...data }
}

const useFetchVersionData = (
  tech: string,
  version: string,
): UseQueryResult<VersionData, Error> =>
  useQuery({
    queryKey: ['versionData', tech, version],
    queryFn: () => fetchVersionData(tech, version),
    enabled: !!tech && !!version,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    refetchInterval: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  })

export default useFetchVersionData
