import { formatDistanceToNowStrict, isAfter } from 'date-fns'

export const extractCycle = (version: string): string => {
  const parts = version.split('.')
  return parts.slice(0, 2).join('.')
}

export const formatDate = (dateString: string): string => {
  try {
    const now = new Date()
    const date = new Date(dateString)

    const distance = formatDistanceToNowStrict(date, { addSuffix: true })

    if (isAfter(date, now)) {
      return distance
    }

    return distance
  } catch {
    return dateString
  }
}
