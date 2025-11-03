import { Info } from "lucide-react"

interface TutorialBoxProps {
  steps: string[]
  title?: string
}

export function TutorialBox({ steps, title = "How to Use This Tool" }: TutorialBoxProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-3 text-sm leading-relaxed">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
