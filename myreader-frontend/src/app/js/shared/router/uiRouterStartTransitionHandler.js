import {routeChange} from 'store'

function uiRouterStartTransitionHandler(criteria, $ngRedux) {
    if (criteria.from().name !== '') {
        return
    }

    const {name: to} = criteria.to()

    let query = {...criteria.params('to')}
    delete query['#']

    let routeAction = routeChange(to.split('.'))
    routeAction.query = {...routeAction.query, ...query}
    $ngRedux.dispatch(routeAction)
}

export default uiRouterStartTransitionHandler
