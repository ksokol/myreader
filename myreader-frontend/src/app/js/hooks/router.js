import {useLocation, useHistory as useRouterHistory} from 'react-router'
import LocationStateContext from '../contexts/locationState/LocationStateContext'
import {useContext} from 'react'

function toSearchParams(location = {}) {
  const query = {}
  for (const [key, value] of new URLSearchParams(location.search || '').entries()) {
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
  const location = useLocation()
  return toSearchParams(location)
}

export function useHistory() {
  const history = useRouterHistory()
  const location = useLocation()
  const context = useContext(LocationStateContext)

  const push = ({searchParams = {}} = {}) => {
    history.push({
      ...location,
      search: toSearch(searchParams)
    })
  }

  return {
    push,
    reload: context.reload
  }
}
