import { base_url } from '../../api/api'

export function resolveImageUrl(path?: string, fallback: string = ''): string {
  if (!path) return fallback
  if (/^https?:\/\//i.test(path)) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base_url}${p}`
}
