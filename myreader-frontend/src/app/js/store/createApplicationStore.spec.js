import createApplicationStore from './createApplicationStore'
import '../../../../__mocks__/global/fetch'

const DEV = 'development'
const PROD = 'production'

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
})
