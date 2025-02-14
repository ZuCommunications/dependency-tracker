import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

type Props = {
  title: string
  content: string
  link: string
  className?: string
  contentClassName?: string
  isExternalLink?: boolean
}

const CardWithLink = ({
  title,
  content,
  link,
  className,
  contentClassName,
  isExternalLink,
}: Props) => {
  return (
    <div className={className}>
      <Link
        href={link}
        target={isExternalLink ? '_blank' : '_self'}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
      >
        <Card className="relative" hover={false}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h1 className={contentClassName}>{content}</h1>
          </CardContent>
          <ExternalLink className="text-muted-foreground absolute top-4 right-4 size-5" />
        </Card>
      </Link>
    </div>
  )
}

export default CardWithLink
