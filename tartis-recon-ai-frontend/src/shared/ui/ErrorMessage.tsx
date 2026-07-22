interface ErrorMessageProps {
  children: React.ReactNode
}

export function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <div className="bg-state-error/10 text-state-error border border-state-error/20 p-4 rounded-xl flex items-center gap-3">
      <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>{children}</div>
    </div>
  )
}
