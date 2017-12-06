import * as types from './action-types';

const initialState = {
    authorized: true,
    role: ''
};

export function securityReducers(state = initialState, action) {
    switch (action.type) {
        case types.SECURITY_UPDATE: {
            const {authorized, role} = action;
            return {...state, authorized, role};
        }
        default: {
            return state;
        }
    }
}
