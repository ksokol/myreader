const uiRouterAdapter = $state => action => $state.go(action.route.join('.'), action.query)

export default uiRouterAdapter
