import React from 'react'
import {mount} from 'enzyme'
import {SecurityProvider} from './SecurityProvider'
import SecurityContext from './SecurityContext'
import {createMockStore} from '../../shared/test-utils'
import {Provider} from 'react-redux'

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
    ).find(TestComponent)
  }

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
    expect(createWrapper().html()).toEqual('expected component')
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().instance().context).toEqual(expect.objectContaining({
      isAdmin: true,
      authorized: true,
      roles: ['ADMIN', 'USER']
    }))
  })

  it('should dispatch action SECURITY_UPDATE when "doAuthorize" triggered', () => {
    createWrapper().instance().context.doAuthorize(['SOME_ROLE'])

    expect(store.getActions()).toEqual([{
      type: 'SECURITY_UPDATE',
      authorized: true,
      roles: ['SOME_ROLE']
    }])
  })
})
