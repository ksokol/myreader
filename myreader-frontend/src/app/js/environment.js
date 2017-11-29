export function isProdMode() {
    return process.env.NODE_ENV === 'production';
}

export function isDevMode() {
    return process.env.NODE_ENV === 'development';
}
