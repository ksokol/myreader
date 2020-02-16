import React from 'react'
import {mount} from 'enzyme'
import {SecurityProvider} from './SecurityProvider'
import SecurityContext from './SecurityContext'
import {createMockStore} from '../../shared/test-utils'
import {Provider} from 'react-redux'
import {api} from '../../api'

/* eslint-disable react/prop-types */
jest.mock('../../api', () => ({
  api: {
    addInterceptor: jest.fn()
  }
}))
/* eslint-enable */

class TestComponent extends React.Component {
  static contextType = SecurityContext
  render = () => 'expected component'
}

describe('security context', () => {

  let store

  const createWrapper = () => {
    return mount(
      <Provider store={store}>
        <SecurityProvider>
          <TestComponent />
        </SecurityProvider>
      </Provider>
    )
  }

  beforeEach(() => {
    api.addInterceptor.mockClear()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  beforeEach(() => {
    store = createMockStore()

    store.setState({
      security: {
        isAdmin: true,
        authorized: true,
        roles: ['ADMIN', 'USER']
      }
    })
  })

  it('should render children', () => {
    expect(createWrapper().find(TestComponent).html()).toEqual('expected component')
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().find(TestComponent).instance().context).toEqual(expect.objectContaining({
      isAdmin: true,
      authorized: true,
      roles: ['ADMIN', 'USER']
    }))
  })

  it('should dispatch action SECURITY_UPDATE when "doAuthorize" triggered', () => {
    createWrapper().find(TestComponent).instance().context.doAuthorize(['SOME_ROLE'])

    expect(store.getActions()).toEqual([{
      type: 'SECURITY_UPDATE',
      authorized: true,
      roles: ['SOME_ROLE']
    }])
  })

  it('should persist roles to local storage when "doAuthorize" triggered', () => {
    createWrapper().find(TestComponent).instance().context.doAuthorize(['SOME_ROLE'])

    expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
      roles: ['SOME_ROLE']
    })
  })

  it('should dispatch action SECURITY_UPDATE when "doUnAuthorize" triggered', () => {
    createWrapper().find(TestComponent).instance().context.doUnAuthorize()

    expect(store.getActions()).toEqual([{
      type: 'SECURITY_UPDATE',
      authorized: false,
      roles: []
    }])
  })

  it('should clear roles from local storage when "doUnAuthorize" triggered', () => {
    createWrapper().find(TestComponent).instance().context.doUnAuthorize()

    expect(JSON.parse(localStorage.getItem('myreader-security'))).toEqual({
      roles: []
    })
  })

  it('should dispatch action SECURITY_UPDATE when status is 401', () => {
    createWrapper()

    api.addInterceptor.mock.calls[0][0].onError(null, {status: 401})

    expect(store.getActions()).toEqual([{
      authorized: false,
      roles: [],
      type: 'SECURITY_UPDATE'
    }])
  })

  it('should not dispatch action SECURITY_UPDATE when status is 200', () => {
    createWrapper()

    api.addInterceptor.mock.calls[0][0].onError(null, {status: 200})

    expect(store.getActions()).toEqual([])
  })
})
