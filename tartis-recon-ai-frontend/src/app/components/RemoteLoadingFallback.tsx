import { shellLabels } from '../labels'

export function RemoteLoadingFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-gray-400"
      role="status"
    >
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="text-sm">{shellLabels.loadingModule}</p>
    </div>
  )
}
