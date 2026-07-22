export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  )
}
