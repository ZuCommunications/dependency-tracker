import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { Info } from 'lucide-react'
import React, { useMemo } from 'react'

interface UpgradeStatusItem {
  categories: string[]
  checkName: string
  description: string
  fingerprint: string
  location: {
    path: string
    line: number
  }
  severity: 'minor' | 'major' | 'info'
  type: string
}

interface D11UpgradeCustomTooltipProps {
  data: Array<Record<string, any>>
  children?: React.ReactNode
}

export function D11UpgradeCustomTooltip({
  children,
  ...props
}: D11UpgradeCustomTooltipProps) {
  const processedData = useMemo(() => preprocessData(props.data), [props.data])

  return (
    <div className="flex items-center gap-2">
      {children}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <Info className="text-muted-foreground hidden h-3 w-3 sm:block" />
          </TooltipTrigger>
          <TooltipContent className="max-h-64 w-100 overflow-y-auto p-0">
            <Content data={processedData} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Popover>
        <PopoverTrigger className="flex items-center">
          <Info className="text-muted-foreground h-3 w-3 sm:hidden" />
        </PopoverTrigger>
        <PopoverContent className="max-h-64 w-100 overflow-y-auto p-0">
          <Content data={processedData} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function preprocessData(data: any): UpgradeStatusItem[] {
  const severityLabels = {
    minor: 'minor',
    major: 'major',
    info: 'info',
  } as const

  const processedData =
    data?.map((item: Record<string, any>) => ({
      categories: item.categories,
      checkName: item.check_name,
      description: item.description,
      fingerprint: item.fingerprint,
      location: {
        path: item.location.path,
        line: item.location.lines.begin,
      },
      severity:
        severityLabels[item.severity as keyof typeof severityLabels] || 'info',
      type: item.type,
    })) ?? []

  return processedData.sort((a: UpgradeStatusItem, b: UpgradeStatusItem) => {
    const order = { info: 0, minor: 1, major: 2 }
    return order[b.severity] - order[a.severity]
  })
}

const Content = ({ data }: { data: UpgradeStatusItem[] }) => {
  return (
    <div className="rounded-md bg-white p-1 text-xs">
      <div className="space-y-3">{renderArray(data)}</div>
    </div>
  )
}

function renderArray(data: UpgradeStatusItem[]) {
  return data.map((item) => <StatusItem key={item.fingerprint} item={item} />)
}

const StatusItem = ({ item }: { item: UpgradeStatusItem }) => {
  const severityConfig = {
    minor: {
      containerClass: 'bg-yellow-50',
      badge: 'bg-yellow-100 text-yellow-800',
      icon: '⚠️',
    },
    major: {
      containerClass: 'bg-red-50',
      badge: 'bg-red-100 text-red-800',
      icon: '🚫',
    },
    info: {
      containerClass: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-800',
      icon: 'ℹ️',
    },
  }

  const config = severityConfig[item.severity]

  return (
    <div className={`rounded-lg border p-1 ${config.containerClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="mb-2 font-medium">{item.checkName}</div>
          <p
            className="mb-2 text-gray-600"
            dangerouslySetInnerHTML={{
              __html: item.description.replace(
                /(https?:\/\/[^\s]+)/g,
                (url) =>
                  `<a href="${url}" class="text-blue-500 underline">${url}</a>`,
              ),
            }}
          />
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${config.badge}`}
            >
              {config.icon} {item.severity.toUpperCase()}
            </span>
            {item.categories.map((category) => (
              <span
                key={category}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[10px] text-gray-500">
        {item.location.path}:{item.location.line}
      </div>
    </div>
  )
}
