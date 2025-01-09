import { fetchAndParseICSEvents } from '@/lib/ics-utils'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { CalendarView } from './CalendarView'
import { Tables } from '../../../database.types'

export const revalidate = 3600 // Revalidate every hour

const CALENDAR_URLS = [
  'webcal://endoflife.date/calendar/drupal.ics',
  'webcal://endoflife.date/calendar/php.ics',
  'webcal://endoflife.date/calendar/nginx.ics',
  'webcal://endoflife.date/calendar/wordpress.ics',
  'webcal://endoflife.date/calendar/varnish.ics',
  'webcal://endoflife.date/calendar/mysql.ics',
  'webcal://endoflife.date/calendar/mariadb.ics',
  'webcal://endoflife.date/calendar/drush.ics',
]

const VERSION_KEYS = [
  'PHP_VERSION',
  'DRUPAL_VERSION',
  'DRUSH_VERSION',
  'DB_VERSION',
  'NGINX_VERSION',
]

async function fetchDependencies() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .in('key', VERSION_KEYS)

  if (error) throw error
  return data
}

function getAffectedProjectsForDB(
  dependencies: Tables<'versions'>[],
  tech: string,
  version: string,
) {
  return dependencies
    .filter((dep) => {
      if (dep.key !== 'DB_VERSION') return false
      const isMariaDB = dep?.value?.toLowerCase().includes('mariadb')
      return isMariaDB
        ? tech.toLowerCase() === 'mariadb' && dep?.value?.startsWith(version)
        : tech.toLowerCase() === 'mysql' && dep?.value?.startsWith(version)
    })
    .map((dep) => dep.id)
}

function getAffectedProjects(
  dependencies: Tables<'versions'>[],
  tech: string,
  version: string,
) {
  const techKey = `${tech.toUpperCase()}_VERSION`
  return dependencies
    .filter((dep) => dep.key === techKey && dep?.value?.startsWith(version))
    .map((dep) => dep.id)
}

function enhanceEvent(event: any, dependencies: Tables<'versions'>[]) {
  const summaryMatch = event.summary.match(/(\w+)\s+(\d+\.\d+)/)
  if (!summaryMatch) return { ...event, affectedProjects: [] }

  const [, tech, version] = summaryMatch

  const affectedProjects =
    tech.toLowerCase() === 'mariadb' || tech.toLowerCase() === 'mysql'
      ? getAffectedProjectsForDB(dependencies, tech, version)
      : getAffectedProjects(dependencies, tech, version)

  return {
    ...event,
    affectedProjects,
  }
}

async function CalendarPage() {
  const [events, dependencies] = await Promise.all([
    fetchAndParseICSEvents(CALENDAR_URLS),
    fetchDependencies(),
  ])

  const enhancedEvents = events.map((event) =>
    enhanceEvent(event, dependencies),
  )

  return <CalendarView events={enhancedEvents} />
}

export default CalendarPage
