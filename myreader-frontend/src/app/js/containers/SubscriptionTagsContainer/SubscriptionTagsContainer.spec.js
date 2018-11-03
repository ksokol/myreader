import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import {SubscriptionTags} from '../../components'
import {createMockStore} from '../../shared/test-utils'
import SubscriptionTagsContainer from './SubscriptionTagsContainer'

describe('SubscriptionTagsContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SubscriptionTagsContainer />
      </Provider>
    )
    return wrapper.find(SubscriptionTags)
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      subscription: {
        subscriptions: [
          {feedTag: {uuid: 'uuid1', name: 'name1', color: 'color1'}},
          {feedTag: {uuid: 'uuid2', name: 'name2', color: null}}
        ]
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().prop('subscriptionTags')).toEqual([
      {uuid: 'uuid1', name: 'name1', color: 'color1'},
      {uuid: 'uuid2', name: 'name2', color: null}
    ])
  })

  it('should dispatch action when prop function "onChange" triggered', () => {
    createContainer().props().onChange({uuid: 'uuid1', name: 'name1', color: 'expected color'})

    expect(store.getActions()[0]).toContainObject({
      type: 'PATCH_SUBSCRIPTION_TAG',
      body: {
        uuid: 'uuid1',
        name: 'name1',
        color: 'expected color'
      }
    })
  })
})
