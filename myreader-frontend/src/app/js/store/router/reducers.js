import * as types from 'store/action-types'
import {initialApplicationState} from 'store'

export function routerReducers(state = initialApplicationState().router, action) {
    switch (action.type) {
        case types.ROUTE_CHANGED: {
            return {...state, query: {...action.query}, currentRoute: action.route}
        }
        default: {
            return state
        }
    }
}
