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

export const Drupal11ReadinessCell = ({ version }: { version: any }) => {
  if (!version) return <>-</>

  const parsedVersion = JSON.parse(version)

  const isError = parsedVersion.some(
    (item: any) =>
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

export const DrupalUpgradeStatusCustomCell = ({
  version,
}: {
  version: any
}) => {
  if (!version) return <>-</>

  let parsedVersion
  try {
    parsedVersion = JSON.parse(version)
  } catch {
    parsedVersion = null
  }

  if (parsedVersion === null) {
    return <Badge variant="outline">N/A</Badge>
  }

  const isError =
    parsedVersion?.some(
      (item: any) => item.severity && item.severity !== 'info',
    ) ?? false

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
