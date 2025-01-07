import { CurrentVersionTooltip } from './CurrentVersionTooltip'
import { Drupal11ReadinessTooltip } from './d11/Drupal11ReadinessTooltip'
import { D11UpgradeCustomTooltip } from './d11/UpgradeCustomTooltip'
import { Badge } from './ui/badge'

export const Cell = ({ tech, version }: { tech: string; version: string }) => {
  switch (tech.toLowerCase()) {
    case 'drupal_11_readiness':
      return <Drupal11ReadinessCell version={version} />
    case 'drupal_upgrade_status_custom':
      return <DrupalUpgradeStatusCustomCell version={version} />
    default:
      return (
        <CurrentVersionTooltip currentVersion={version} searchKey={tech}>
          {version || '-'}
        </CurrentVersionTooltip>
      )
  }
}

interface Drupal11ReadinessItem {
  class?: string | string[]
  message?: string
}

export const Drupal11ReadinessCell = ({
  version,
}: {
  version: string | null
}) => {
  if (!version) return <>-</>

  let parsedVersion: Drupal11ReadinessItem[]
  try {
    parsedVersion = JSON.parse(version)
    if (!Array.isArray(parsedVersion)) {
      console.error('Expected array for Drupal11Readiness data')
      return <Badge variant="outline">Error</Badge>
    }
  } catch (error) {
    console.error('Error parsing Drupal11Readiness data:', error)
    return <Badge variant="outline">Error</Badge>
  }

  const isError = parsedVersion.some(
    (item) =>
      item.class &&
      ((typeof item.class === 'string' && item.class === 'color-error') ||
        (Array.isArray(item.class) && item.class.includes('color-error'))),
  )

  return (
    <Drupal11ReadinessTooltip data={parsedVersion}>
      {isError ? (
        <Badge variant={'destructive'}>No</Badge>
      ) : (
        <Badge variant={'success'}>Yes</Badge>
      )}
    </Drupal11ReadinessTooltip>
  )
}

interface DrupalUpgradeStatusItem {
  severity?: string
  message?: string
}

export const DrupalUpgradeStatusCustomCell = ({
  version,
}: {
  version: string | null
}) => {
  if (!version) return <>-</>

  let parsedVersion: DrupalUpgradeStatusItem[] | null = null
  try {
    const parsed = JSON.parse(version)
    if (Array.isArray(parsed)) {
      parsedVersion = parsed
    } else {
      console.error('Expected array for DrupalUpgradeStatus data')
    }
  } catch (error) {
    console.error('Error parsing DrupalUpgradeStatus data:', error)
  }

  if (parsedVersion === null) {
    return <Badge variant="outline">N/A</Badge>
  }

  const isError = parsedVersion.some(
    (item) => item.severity && item.severity !== 'info',
  )

  return (
    <D11UpgradeCustomTooltip data={parsedVersion}>
      {isError ? (
        <Badge variant={'destructive'}>No</Badge>
      ) : (
        <Badge variant={'success'}>Yes</Badge>
      )}
    </D11UpgradeCustomTooltip>
  )
}
