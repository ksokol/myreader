export function createArrayMiddleware() {
    return ({dispatch, getState}) => next => action => {
        if (Array.isArray(action)) {
            action.forEach(it => dispatch(it, getState))
        } else {
            next(action)
        }
    }
}

const arrayMiddleware =  createArrayMiddleware()

export default arrayMiddleware
