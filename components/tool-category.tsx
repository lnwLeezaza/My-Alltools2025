import type { ReactNode } from "react"

interface ToolCategoryProps {
  title: string
  description: string
  children: ReactNode
}

export function ToolCategory({ title, description, children }: ToolCategoryProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
    </section>
  )
}
