export function truncateId(value: string): string {
  const isUuid = value.length > 12 && value.includes('-')
  return isUuid ? `${value.slice(0, 8)}...` : value
}
