import { getUsername, getRoles, logout } from '@/lib/keycloak'
import { authLabels } from '../labels'

export function UserMenu() {
  const username = getUsername()
  const roles = getRoles()

  if (!username) return null

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border-subtle bg-surface-card px-4 py-2">
      <div className="flex flex-col text-right">
        <span className="text-sm font-bold leading-tight text-white" data-testid="username">
          {username}
        </span>
        <span className="font-mono text-xs leading-tight text-brand-400" data-testid="roles">
          {roles.join(', ') || authLabels.noRole}
        </span>
      </div>
      <div className="h-6 w-px bg-border-subtle" />
      <button
        type="button"
        onClick={logout}
        title={authLabels.logout}
        aria-label={authLabels.logout}
        className="cursor-pointer text-gray-400 transition-colors hover:text-red-400"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  )
}
