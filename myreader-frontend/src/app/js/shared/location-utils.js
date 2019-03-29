export const toQueryObject = (location = {}) => {
  const query = {}
  for (const [k, v] of new URLSearchParams(location.search || '').entries()) {

    // TODO Remove if/else if  together with UI Router
    if (v === 'null') {
      query[k] = null
    } else if (v === 'undefined') {
      query[k] = undefined
    } else {
      query[k] = v
    }
  }

  return query
}

export const withQuery = (location = {}, query = {}, state = {}) => {
  return {
    ...location,
    query,
    state
  }
}
