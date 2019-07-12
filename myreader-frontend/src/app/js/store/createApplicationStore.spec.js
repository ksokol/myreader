import createApplicationStore from './createApplicationStore'
import '../../../../__mocks__/global/fetch'

const DEV = 'development'
const PROD = 'production'
const OTHER = 'other'

describe('createApplicationStore', () => {

  describe('redux dev tools', () => {

    beforeEach(() => {
      window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] = jest.fn()
      window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'].mockReturnValueOnce(() => {})
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
      localStorage.setItem('myreader-settings', '{"pageSize":2,"showEntryDetails":false,"showUnseenEntries":false}')
      localStorage.setItem('myreader-security', '{"roles":[]}')
      window.location.hash = ''
    })

    it('should initialize last security state when in production environment', () => {
      const store = createApplicationStore(PROD)

      expect(store.getState().security).toContainObject({authorized: false, roles: []})
    })

    it('should initialize last security state when in development environment', () => {
      const store = createApplicationStore(DEV)

      expect(store.getState().security).toContainObject({authorized: false, roles: []})
    })

    it('should not initialize last security state when environment is other', () => {
      localStorage.setItem('myreader-security', '{roles: ["unexpected role"]}')
      const store = createApplicationStore(OTHER)

      expect(store.getState().security).toContainObject({roles: []})
    })
  })
})
