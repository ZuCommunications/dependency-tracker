import React, { useMemo } from 'react'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'

interface Drupal11ReadinessTooltipProps {
  data: Array<Record<string, any>>
  children?: React.ReactNode
}

export function Drupal11ReadinessTooltip({
  children,
  ...props
}: Drupal11ReadinessTooltipProps) {
  const processedData = useMemo(() => preprocessData(props.data), [props.data])

  return (
    <div className="flex items-center gap-2">
      {children}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <Info className="hidden h-3 w-3 text-muted-foreground sm:block" />
          </TooltipTrigger>
          <TooltipContent className="w-100 max-h-64 overflow-y-auto p-0">
            <Content data={processedData} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Popover>
        <PopoverTrigger className="flex items-center">
          <Info className="h-3 w-3 text-muted-foreground sm:hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-100 max-h-64 overflow-y-auto p-0">
          <Content data={processedData} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Data pre-processing function
function preprocessData(data: any) {
  const statusLabels = {
    'color-warning': 'Warning',
    'color-error': 'Error',
    'color-success': 'Success',
  }
  // @ts-ignore
  const processedData = data.map((item) => ({
    class: item.class,
    requirement: extractText(item.data.requirement),
    status: extractStatus(item.data.status),
    // @ts-ignore
    statusLabel: statusLabels[item.class] || 'Unknown',
  }))

  // Sort errors first, then warnings, then successes
  return processedData.sort(
    (a: { statusLabel: string }, b: { statusLabel: string }) => {
      const order: Record<string, number> = { Error: 1, Warning: 2, Success: 3 }
      return order[a.statusLabel] - order[b.statusLabel]
    },
  )
}

function extractText(requirement: any) {
  if (typeof requirement.data === 'string') {
    return capitalizeSentence(requirement.data)
  }
  return requirement.data?.['#markup'] || 'N/A'
}

function extractStatus(status: any) {
  if (typeof status.data === 'string') {
    return capitalizeSentence(status.data)
  }
  if (status.data?.['#type'] === 'link') {
    return {
      text: status.data['#title'],
      url: status.data['#url'].path || '#',
    }
  }
  if (status.data?.['#markup']) {
    return status.data['#markup']
  }
  return 'N/A'
}

function capitalizeSentence(text: string) {
  return text.replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase())
}

const Content = ({ data }: Omit<Drupal11ReadinessTooltipProps, 'children'>) => {
  return (
    <div className="rounded-md bg-white p-2 text-xs text-black">
      <ul className="space-y-1">{renderArray(data)}</ul>
    </div>
  )
}

function renderObject(data: Record<string, any>) {
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-start justify-between space-x-2">
          <span className="flex-shrink-0 text-sm font-medium text-gray-600">
            {formatKey(key)}:
          </span>
          <span className="flex-grow break-words text-sm text-gray-800">
            {formatValue(value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function formatValue(value: any): any {
  if (Array.isArray(value)) {
    return (
      <ul className="list-inside list-disc">
        {value.map((item, index) => (
          <li key={index} className="mr-2 inline-block">
            {formatValue(item)}
          </li>
        ))}
      </ul>
    )
  } else if (typeof value === 'object' && value !== null) {
    if (value.text && value.url) {
      return (
        <a href={value.url} className="text-blue-500 underline">
          {value.text}
        </a>
      )
    }
    return renderObject(value)
  } else if (typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value)) {
    return <span dangerouslySetInnerHTML={{ __html: value }} />
  }
  return String(value || 'N/A')
}

function formatKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

function renderArray(data: Array<Record<string, any>>) {
  return data.map((item, index) => <StatusItem key={index} item={item} />)
}

const StatusItem = ({ item }: { item: Record<string, any> }) => {
  const statusClass = item.class.includes('color-warning')
    ? 'bg-yellow-100 text-yellow-800'
    : item.class.includes('color-error')
      ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800'

  return (
    <div className={`flex flex-col gap-1 rounded-md border p-2 ${statusClass}`}>
      <div className="font-bold">{item.statusLabel}</div>
      <div>{item.requirement}</div>
      <div>{formatValue(item.status)}</div>
    </div>
  )
}
