import { Link } from '@tanstack/react-router'
import { shellLabels } from '../labels'

export function RemoteUnavailable() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-state-error/10">
        <svg
          className="h-8 w-8 text-state-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-white">
        {shellLabels.moduleUnavailable}
      </h2>
      <p className="max-w-md text-center text-sm text-gray-400">
        {shellLabels.moduleUnavailableDescription}
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-brand-400"
      >
        {shellLabels.backToHome}
      </Link>
    </div>
  )
}
