export function truncateId(value: string): string {
  if (!value) return value ?? ''
  const isUuid = value.length > 12 && value.includes('-')
  return isUuid ? `${value.slice(0, 8)}...` : value
}
