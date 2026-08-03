import type { ReactNode } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { shellLabels } from '../labels'

export function ShellLayout() {
  return (
    <div className="min-h-screen bg-surface-app text-white font-sans antialiased">
      <header className="border-b border-border-subtle bg-surface-panel">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-brand-400">
            {shellLabels.title}
          </h1>
        </div>
      </header>

      <nav
        className="border-b border-border-subtle bg-surface-panel/50"
        aria-label="Navegación principal"
      >
        <div className="mx-auto flex max-w-7xl gap-1 px-6">
          <ShellNavLink to="/" exact>
            {shellLabels.navHome}
          </ShellNavLink>
          <ShellNavLink to="/entry-exit">
            {shellLabels.navEntryExit}
          </ShellNavLink>
          <ShellNavLink to="/admin">
            {shellLabels.navAdmin}
          </ShellNavLink>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

function ShellNavLink({
  to,
  exact = false,
  children,
}: {
  to: string
  exact?: boolean
  children: ReactNode
}) {
  const base = 'border-b-2 px-4 py-3 text-sm font-medium transition-colors'

  return (
    <Link
      to={to}
      activeProps={{
        className: `${base} border-brand-500 text-brand-400`,
      }}
      inactiveProps={{
        className: `${base} border-transparent text-gray-400 hover:text-white`,
      }}
      activeOptions={{ exact }}
    >
      {children}
    </Link>
  )
}
