import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import FeedEditPageContainer from '../FeedEditPageContainer/FeedEditPageContainer'
import {createMockStore} from '../../shared/test-utils'

describe('FeedEditPageContainer', () => {

  let store

  const createContainer = () => {
    const wrapper = mount(
      <Provider store={store}>
        <FeedEditPageContainer />
      </Provider>
    )
    return wrapper.find(FeedEditPageContainer).children().first()
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      admin: {
        editForm: {
          changePending: true,
          data: {uuid: '1', title: 'title1', url: 'url1', createdAt: '2017-12-29'},
          validations: [{field: 'title', message: 'may not be empty'}]
        },
        fetchFailuresLoading: true,
        fetchFailures: {
          links: {next: {path: 'next', query: {a: 'b'}}},
          failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}]
        }
      }
    })
  })

  it('should initialize component with given props', () => {
    expect(createContainer().props()).toContainObject({
      changePending: true,
      fetchFailuresLoading: true,
      data: {uuid: '1', title: 'title1', url: 'url1', createdAt: '2017-12-29'},
      validations: [{field: 'title', message: 'may not be empty'}],
      links: {next: {path: 'next', query: {a: 'b'}}},
      failures: [{uuid: '2', createdAt: '2017-01-29'}, {uuid: '3', createdAt: '2017-02-28'}]
    })
  })

  it('should dispatch expected action when prop function "onChangeFormData" triggered', () => {
    createContainer().props().onChangeFormData({a: 'b', c: 'd'})

    expect(store.getActions()[0]).toEqual({
      type: 'FEED_EDIT_FORM_CHANGE_DATA',
      data: {a: 'b', c: 'd'}
    })
  })

  it('should dispatch expected action when prop function "onSaveFormData" triggered', () => {
    createContainer().props().onSaveFormData({uuid: '1', a: 'b', c: 'd'})

    expect(store.getActions()[0]).toContainObject({
      type: 'PATCH_FEED',
      body: {a: 'b', c: 'd'}
    })
  })

  it('should dispatch expected action when prop function "onRemove" triggered', () => {
    createContainer().props().onRemove('1')

    expect(store.getActions()[0].type).toEqual('DELETE_FEED')
    expect(store.getActions()[0].url).toMatch(/api\/2\/feeds\/1$/)
  })

  it('should dispatch expected action when prop function "onMore" triggered', () => {
    createContainer().props().onMore({path: 'next', query: {a: 'b'}})

    expect(store.getActions()[0].type).toEqual('GET_FEED_FETCH_FAILURES')
    expect(store.getActions()[0].url).toEqual('next?a=b')
  })
})
