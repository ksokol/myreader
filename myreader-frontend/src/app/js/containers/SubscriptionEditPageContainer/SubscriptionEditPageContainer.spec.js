import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import SubscriptionEditPageContainer from '../SubscriptionEditPageContainer/SubscriptionEditPageContainer'
import {createMockStore} from '../../shared/test-utils'

describe('SubscriptionEditPageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SubscriptionEditPageContainer />
      </Provider>
    )
    return wrapper.find(SubscriptionEditPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      router: {
        query: {
          uuid: '1'
        }
      },
      subscription: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'may not be empty'}]
        },
        subscriptions: [
          {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-12-29'},
          {uuid: '2', title: 'title2', origin: 'origin2', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-11-30'},
          {uuid: '3', title: 'title3', origin: 'origin3', feedTag: {uuid: '3', name: 'tag1'}, createdAt: '2017-12-01'},
        ],
        exclusions: {
          '1': [{uuid: '10', pattern: 'exclusion1', hitCount: 1}, {uuid: '11', pattern: 'exclusion2', hitCount: 2}],
          '2': [{uuid: '13', pattern: 'exclusion3', hitCount: 2}],
        }
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      changePending: true,
      data: {uuid: '1', title: 'title1', origin: 'origin1', feedTag: {uuid: '2', name: 'tag'}, createdAt: '2017-12-29'},
      validations: [{field: 'title', message: 'may not be empty'}],
      subscriptionTags: [{uuid: '2', name: 'tag'}, {uuid: '3', name: 'tag1'}],
      exclusions: [{uuid: '10', pattern: 'exclusion1'}, {uuid: '11', pattern: 'exclusion2'}]
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

  it('should dispatch expected action when prop function "onRemoveSubscription" triggered', () => {
    createContainer().props().onRemoveSubscription('1')

    expect(store.getActions()[0].type).toEqual('DELETE_SUBSCRIPTION')
    expect(store.getActions()[0].url).toMatch(/api\/2\/subscriptions\/1$/)
  })

  it('should dispatch expected action when prop function "onRemoveExclusionPattern" triggered', () => {
    createContainer().props().onRemoveExclusionPattern('1', '10')

    expect(store.getActions()[0].type).toEqual('DELETE_SUBSCRIPTION_EXCLUSION_PATTERNS')
    expect(store.getActions()[0].url).toMatch(/api\/2\/exclusions\/1\/pattern\/10$/)
  })

  it('should dispatch expected action when prop function "onAddExclusionPattern" triggered', () => {
    createContainer().props().onAddExclusionPattern('1', 'tag')

    expect(store.getActions()[0]).toContainObject({
      type: 'POST_SUBSCRIPTION_EXCLUSION_PATTERN',
      body: {
        pattern: 'tag'
      }
    })
  })
})
