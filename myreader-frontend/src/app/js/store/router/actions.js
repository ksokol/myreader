import * as types from '../../store/action-types'

export const routeChange = ({route, query = {}} = {}, options = {}) => {
  return {
    type: types.ROUTE_CHANGED,
    route,
    query,
    options
  }
}
