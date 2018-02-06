import {cloneObject} from '../shared/objects'

export const routeSelector = state => {
    return {
        router: cloneObject(state.router)
    }
}
