import {isObject, isString} from '../../../shared/utils'

export function createGuardMiddleware() {
    return () => next => action => {
        if (isObject(action) && isString(action.type)) {
            return next(action)
        }
    }
}

const guardMiddleware =  createGuardMiddleware()

export default guardMiddleware
