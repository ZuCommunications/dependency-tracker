import React from 'react'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { format } from 'date-fns'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'

interface InfoTooltipProps {
  data: Array<Record<string, string>>
  children?: React.ReactNode
}

export function InfoTooltip({ children, ...props }: InfoTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="flex items-center">
            <Info className="text-muted-foreground hidden h-3 w-3 sm:block" />
          </TooltipTrigger>
          <TooltipContent className="max-h-64 w-64 overflow-y-auto p-0">
            <InfoContent {...props} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Popover>
        <PopoverTrigger className="flex items-center">
          <Info className="text-muted-foreground h-3 w-3 sm:hidden" />
        </PopoverTrigger>
        <PopoverContent className="max-h-64 w-64 overflow-y-auto p-0">
          <InfoContent {...props} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

const InfoContent = ({ data }: Omit<InfoTooltipProps, 'children'>) => {
  return (
    <div className="rounded-md bg-white p-2 text-xs text-black">
      <ul className="space-y-1">
        {renderArray(Array.isArray(data) ? data : [data])}
      </ul>
    </div>
  )
}

function renderObject(data: Record<string, any>) {
  return Object.entries(data).map(([key, value]) => (
    <li key={key} className="flex justify-between">
      <span className="font-medium">{formatKey(key)}:</span>
      <span>{formatValue(value)}</span>
    </li>
  ))
}

function renderArray(data: Array<Record<string, any>>) {
  return data.map((item, index) => (
    <div key={index} className="flex flex-col gap-1 rounded-md border p-2">
      {renderObject(item)}
    </div>
  ))
}

function formatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return format(value, 'MMM d, yyyy')
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return format(new Date(value), 'MMM d, yyyy')
  }
  return String(value)
}
