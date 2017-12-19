import createApplicationStore from './bootstrap'

const DEV = 'development'
const PROD = 'production'
const OTHER = 'other'

describe('src/app/js/store/bootstrap.spec.js', () => {

    describe('redux dev tools', () => {

        beforeEach(() => {
            window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] = jasmine.createSpy('compose')
            window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'].and.returnValue(() => {})
        })

        it('should enable dev tools when running in development mode', () => {
            createApplicationStore(DEV)

            expect(window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']).toHaveBeenCalled()
        })

        it('should not enable dev tools when not running in development mode', () => {
            createApplicationStore(PROD)

            expect(window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']).not.toHaveBeenCalled()
        })
    })

    describe('store creation', () => {

        beforeEach(() => {
            localStorage.setItem('myreader-settings', `{"pageSize":2,"showEntryDetails":false,"showUnseenEntries":false}`)
            localStorage.setItem('myreader-security', `{"authorized":false}`)
            window.location.hash = ''
        })

        it('should initialize settings when in production environment', () => {
            const store = createApplicationStore(PROD)

            expect(store.getState().settings).toEqual({pageSize: 2, showEntryDetails: false, showUnseenEntries: false})
        })

        it('should initialize settings when in development environment', () => {
            const store = createApplicationStore(DEV)

            expect(store.getState().settings).toEqual({pageSize: 2, showEntryDetails: false, showUnseenEntries: false})
        })

        it('should not initialize settings when environment is other', () => {
            const store = createApplicationStore(OTHER)

            expect(store.getState().settings).toEqual({pageSize: 10, showEntryDetails: true, showUnseenEntries: true})
        })

        it('should initialize last security state when in production environment', () => {
            const store = createApplicationStore(PROD)

            expect(store.getState().security).toEqual({authorized: false, role: ''})
        })

        it('should initialize last security state when in development environment', () => {
            const store = createApplicationStore(DEV)

            expect(store.getState().security).toEqual({authorized: false, role: ''})
        })

        it('should not initialize last security state when environment is other', () => {
            const store = createApplicationStore(OTHER)

            expect(store.getState().security).toEqual({authorized: true, role: ''})
        })

        it('should subscribe to state changes and should redirect to login page when session expired', () => {
            const store = createApplicationStore(OTHER)
            store.dispatch({type: 'SECURITY_UPDATE', authorized: false})

            expect(window.location.hash).toEqual('#/login')
        })

        it('should subscribe to state changes and should not redirect to login page when session valid', () => {
            const store = createApplicationStore(OTHER)
            store.dispatch({type: 'SECURITY_UPDATE', authorized: true})

            expect(window.location.hash).toEqual('')
        })
    })

    describe('middleware', () => {

        it('should integrate with redux thunk and custom fetch middleware', done => {
            const store = createApplicationStore(OTHER)

            store.dispatch({
                type: 'GET',
                url: '/',
                success: done
            })
        })
    })
})
