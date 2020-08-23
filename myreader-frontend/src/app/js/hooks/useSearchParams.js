import {useLocation} from 'react-router'

function toSearchParams(location = {}) {
  const query = {}
  for (const [key, value] of new URLSearchParams(location.search || '').entries()) {
    query[key] = value
  }
  return query
}

export function useSearchParams() {
  const location = useLocation()
  return toSearchParams(location)
}
