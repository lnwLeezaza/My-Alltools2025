import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  badge?: string
}

export function ToolCard({ title, description, icon: Icon, href, badge }: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-6 w-6" />
            </div>
            {badge && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{badge}</span>
            )}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
