const uiRouterAdapter = $state => action => $state.go(action.route.join('.'), action.query, action.options)

export default uiRouterAdapter
