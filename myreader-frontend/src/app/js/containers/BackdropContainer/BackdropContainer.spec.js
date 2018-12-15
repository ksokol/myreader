import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {createMockStore} from '../../shared/test-utils'
import BackdropContainer from './BackdropContainer'

describe('BackdropContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <BackdropContainer />
      </Provider>
    )
    return wrapper.find(BackdropContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      common: {
        backdropVisible: true
      }
    })
  })

  it('should pass expected props', () => {
    expect(createContainer().props()).toContainObject({
      isBackdropVisible: true
    })
  })

  it('should dispatch action when prop function "onClick" triggered', () => {
    createContainer().props().onClick()

    expect(store.getActionTypes()).toContainObject(['HIDE_BACKDROP'])
  })
})
