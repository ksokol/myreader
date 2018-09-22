import * as types from '../../store/action-types'
import {findRouteConfiguration} from './routes'

export const routeChange = (route, query = {}, options = {}) => {
  const routeConfiguration = findRouteConfiguration(route)
  return {
    type: types.ROUTE_CHANGED,
    ...routeConfiguration,
    query: {...routeConfiguration.query, ...query},
    options
  }
}
