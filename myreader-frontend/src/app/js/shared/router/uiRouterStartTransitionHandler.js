import {routeChange} from '../../store'

function uiRouterStartTransitionHandler(criteria, $ngRedux) {
  let routeAction = routeChange(criteria.to().name.split('.'))
  let query = {...criteria.params('to')}
  delete query['#']

  routeAction.query = {...routeAction.query, ...query}
  $ngRedux.dispatch(routeAction)
}

export default uiRouterStartTransitionHandler
