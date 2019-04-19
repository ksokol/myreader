import {securityReducers} from './reducers'
import initialState from '.'

describe('security reducers', () => {

  let state

  beforeEach(() => {
    state = initialState()
  })

  describe('action SECURITY_UPDATE', () => {

    it('should set authorized and roles', () => {
      const expected = {roles: ['expected role']}

      expect(securityReducers(state, {type: 'SECURITY_UPDATE', ...expected})).toEqual(expected)
    })
  })
})
