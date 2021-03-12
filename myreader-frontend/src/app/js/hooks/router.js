import {useMemo} from 'react'
import {useLocation} from 'react-router'

function toSearchParams(search) {
  const query = {}
  for (const [key, value] of new URLSearchParams(search).entries()) {
    query[key] = value
  }
  return query
}

export function useSearchParams() {
  const search = useLocation().search || ''
  return useMemo(() => toSearchParams(search), [search])
}
