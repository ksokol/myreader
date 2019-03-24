export const toQueryObject = (location = {}) => {
  const query = {}
  for (const [k, v] of new URLSearchParams(location.search || '').entries()) {
    query[k] = v
  }
  return query
}

export const withQuery = (location = {}, query = {}) => {
  return {
    ...location,
    query
  }
}
