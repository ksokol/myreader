import {useMemo} from 'react'
import {generatePath, useHistory as useRouterHistory, useLocation} from 'react-router'

function toSearchParams(search) {
  const query = {}
  for (const [key, value] of new URLSearchParams(search).entries()) {
    query[key] = value
  }
  return query
}

function toSearch(queryParam) {
  const searchParams = new URLSearchParams()
  for (const [k, v] of Object.entries(queryParam)) {
    if (typeof v !== 'undefined' && v !== null) {
      searchParams.set(k, v)
    }
  }
  return searchParams.toString()
}

export function useSearchParams() {
  const search = useLocation().search || ''
  return useMemo(() => toSearchParams(search), [search])
}

export function useHistory() {
  const history = useRouterHistory()
  const location = useLocation()

  const push = ({searchParams = {}} = {}) => {
    history.push({
      ...location,
      search: toSearch(searchParams)
    })
  }

  const replace = ({pathname, params}) => {
    history.replace({
      pathname: generatePath(pathname, {...params})
    })
  }

  return {
    push,
    replace,
  }
}
