import React from 'react'
import {shallow} from 'enzyme'
import {SubscriptionExclusions} from './SubscriptionExclusions'
import {subscriptionExclusionsApi} from '../../../api'
import {toast} from '../../Toast'
import {flushPromises, pending, rejected, resolved} from '../../../shared/test-utils'

/* eslint-disable react/prop-types */
jest.mock('../../../api', () => ({
  subscriptionExclusionsApi: {}
}))

jest.mock('../../Toast', () => ({
  toast: jest.fn()
}))
/* eslint-enable */

const expectedError = 'expected error'

describe('SubscriptionExclusions', () => {

  const exclusions = [
    {uuid: '1', pattern: 'c'},
    {uuid: '2', pattern: 'aa'},
    {uuid: '3', pattern: 'a'}
  ]

  let props

  const createWrapper = async (onMount = resolved([...exclusions])) => {
    subscriptionExclusionsApi.fetchExclusions = onMount

    const wrapper = shallow(<SubscriptionExclusions {...props} />)
    await flushPromises()
    wrapper.update()

    return wrapper
  }

  beforeEach(() => {
    toast.mockClear()

    props = {
      subscription: {
        uuid: 'uuid1'
      }
    }
  })

  it('should disable chip component on mount when fetching exclusions', async () => {
    const wrapper = await createWrapper(pending())

    expect(wrapper.find('Chips').prop('disabled')).toEqual(true)
  })

  it('should enable chip component on mount when exclusions fetched', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Chips').prop('disabled')).toEqual(false)
  })

  it('should sort exclusions on mount when exclusions fetched', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Chips').prop('values')).toEqual([
      {uuid: '3', pattern: 'a'},
      {uuid: '2', pattern: 'aa'},
      {uuid: '1', pattern: 'c'}
    ])
  })

  it('should trigger toast on mount when exclusions could not be fetched', async () => {
    await createWrapper(rejected(expectedError))

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should disable chip component when saving new exclusion', async () => {
    subscriptionExclusionsApi.saveExclusion = pending()
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onAdd()
    wrapper.update()

    expect(wrapper.find('Chips').prop('disabled')).toEqual(true)
  })

  it('should enable chip component when new exclusion saved', async () => {
    subscriptionExclusionsApi.saveExclusion = resolved({})
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onAdd()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('Chips').prop('disabled')).toEqual(false)
  })

  it('should trigger toast when new exclusion could not be saved', async () => {
    subscriptionExclusionsApi.saveExclusion = rejected(expectedError)
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onAdd()
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should pass new exclusion to chip component when new exclusion saved', async () => {
    subscriptionExclusionsApi.saveExclusion = resolved({uuid: '4', pattern: 'b'})
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onAdd()
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('Chips').prop('values')).toEqual([
      {uuid: '3', pattern: 'a'},
      {uuid: '2', pattern: 'aa'},
      {uuid: '4', pattern: 'b'},
      {uuid: '1', pattern: 'c'}
    ])
  })

  it('should disable chip component when deleting exclusion', async () => {
    subscriptionExclusionsApi.removeExclusion = pending()
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onRemove({})
    wrapper.update()

    expect(wrapper.find('Chips').prop('disabled')).toEqual(true)
  })

  it('should enable chip component when exclusion deleted', async () => {
    subscriptionExclusionsApi.removeExclusion = resolved({})
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onRemove({})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('Chips').prop('disabled')).toEqual(false)
  })

  it('should trigger toast when exclusion deletion failed', async () => {
    subscriptionExclusionsApi.removeExclusion = rejected(expectedError)
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onRemove({})
    await flushPromises()
    wrapper.update()

    expect(toast).toHaveBeenCalledWith(expectedError, {error: true})
  })

  it('should remove exclusion from chip component when exclusion deleted', async () => {
    subscriptionExclusionsApi.removeExclusion = resolved()
    const wrapper = await createWrapper()
    wrapper.find('Chips').props().onRemove({uuid: '2'})
    await flushPromises()
    wrapper.update()

    expect(wrapper.find('Chips').prop('values')).toEqual([
      {uuid: '3', pattern: 'a'},
      {uuid: '1', pattern: 'c'}
    ])
  })

  it('should return expected chip item key', async () => {
    const wrapper = await createWrapper()

    expect(wrapper.find('Chips').props().keyFn({uuid: '10'})).toEqual('10')
  })

  it('should render chip item', async () => {
    const wrapper = await createWrapper()
    const Item = wrapper.find('Chips').props().renderItem

    expect(shallow(<Item {...{pattern: 'exclusion2', hitCount: 2}}/>).html()).toEqual(
      '<strong>exclusion2</strong> <em>(2)</em>'
    )
  })
})
