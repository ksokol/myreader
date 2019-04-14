export default function routerHandler(routerAdapter) {
  return ({action}) => routerAdapter(action)
}
