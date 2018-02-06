import routerMiddleware from './routerMiddleware'
import routerHandler from './routerHandler'

const createRouterMiddleware = routerAdapter => routerMiddleware(routerHandler(routerAdapter))

export default createRouterMiddleware
