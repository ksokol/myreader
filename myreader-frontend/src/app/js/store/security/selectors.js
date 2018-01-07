export const getAuthorized = state => {
    return state.security.authorized
}

export const adminPermissionSelector = state => state.security.role === 'admin'
