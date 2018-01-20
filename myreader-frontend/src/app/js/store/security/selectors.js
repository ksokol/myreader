import {createSelector} from 'reselect'

const securitySelector = state => state.security

export const authorizedSelector = createSelector(
    securitySelector,
    security => security.authorized
)

export const adminPermissionSelector = createSelector(
    securitySelector,
    security => security.role === 'ROLE_ADMIN'
)
