export function AdSpace({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      id={`ad-space-${position}`}
      className="w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center"
    >
      <p className="text-sm text-muted-foreground">Advertisement Space - {position}</p>
    </div>
  )
}
