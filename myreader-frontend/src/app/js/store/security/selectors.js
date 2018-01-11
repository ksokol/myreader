export const authorizedSelector = state => state.security.authorized

export const adminPermissionSelector = state => state.security.role === 'admin'
