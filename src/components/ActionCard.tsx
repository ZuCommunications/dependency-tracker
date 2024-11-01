import React from 'react'
import { Button } from './ui/button'
import { Activity, Clock4Icon, Flag, GitBranch } from 'lucide-react'

type Props = {
  title: string
  branch: string
  runStart: string
  status: string
  conclusion: string
  link: string
}

const ActionCard = ({
  title,
  branch,
  runStart,
  status,
  conclusion,
  link,
}: Props) => {
  return (
    <div className="{successState ? '' : 'bg-red-100'} flex flex-col justify-between gap-4 rounded-xl border bg-card px-4 py-6 text-card-foreground shadow transition-all hover:scale-105">
      <div className="flex flex-col gap-2">
        <h1 className="mb-4 text-xl font-medium">{title}</h1>
        <p>
          <GitBranch className="inline" /> {branch}
        </p>
        <p>
          <Clock4Icon className="inline" /> {runStart}
        </p>
        <p>
          <Activity className="inline" /> {status}
        </p>
        <p>
          <Flag className="inline" />
          {conclusion === 'failure' ? (
            <span className="text-red-500"> {conclusion}</span>
          ) : conclusion === 'success' ? (
            <span className="text-green-500"> {conclusion}</span>
          ) : (
            <span> {conclusion}</span>
          )}
        </p>
      </div>

      <a href={link} target="_blank" className="w-full">
        <Button className="w-full">View Run</Button>
      </a>
    </div>
  )
}

export default ActionCard
