export function createArrayMiddleware() {
    return ({dispatch, getState}) => next => action => {
        return Array.isArray(action) ?
            action.map(it => dispatch(it, getState)) :
            next(action)
    }
}

const arrayMiddleware =  createArrayMiddleware()

export default arrayMiddleware
