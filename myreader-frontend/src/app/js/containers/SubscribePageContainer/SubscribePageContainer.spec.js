import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import SubscribePageContainer from '../SubscribePageContainer/SubscribePageContainer'
import {createMockStore} from '../../shared/test-utils'

describe('SubscribePageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SubscribePageContainer />
      </Provider>
    )
    return wrapper.find(SubscribePageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      subscription: {
        editForm: {
          changePending: true,
          data: {
            origin: 'origin'
          },
          validations: [{field: 'origin', message: 'may not be empty'}]
        }
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      changePending: true,
      data: {origin: 'origin'},
      validations: [{field: 'origin', message: 'may not be empty'}],
    })
  })

  it('should dispatch expected action when prop function "onChangeFormData" triggered', () => {
    createContainer().props().onChangeFormData({a: 'b', c: 'd'})

    expect(store.getActions()[0]).toEqual({
      type: 'SUBSCRIPTION_EDIT_FORM_CHANGE_DATA',
      data: {a: 'b', c: 'd'}
    })
  })

  it('should dispatch expected action when prop function "onSaveFormData" triggered', () => {
    createContainer().props().onSaveFormData({a: 'b', c: 'd'})

    expect(store.getActions()[0]).toContainObject({
      type: 'POST_SUBSCRIPTION',
      body: {a: 'b', c: 'd'}
    })
  })
})
