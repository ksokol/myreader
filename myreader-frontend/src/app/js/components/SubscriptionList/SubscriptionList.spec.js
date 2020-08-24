import React from 'react'
import {shallow} from 'enzyme'
import {SubscriptionList} from './SubscriptionList'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {useSearchParams} from '../../hooks/router'

/* eslint-disable react/prop-types */
jest.mock('../../hooks/router', () => ({
  useSearchParams: jest.fn().mockReturnValue({})
}))
/* eslint-enable */

describe('SubscriptionList', () => {

  let props

  const createWrapper = () => shallow(<SubscriptionList {...props} />)

  beforeEach(() => {
    props = {
      subscriptions: [
        {uuid: '1', title: 'title1', createdAt: '1'},
        {uuid: '2', title: 'title2', createdAt: '2'}
      ],
    }
  })

  it('should pass prop "to" to link component', () => {
    const links = createWrapper().find('Link')

    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })

  it('filteredBySearchSubscriptionsSelector should return first subscription matching query "title1"', () => {
    useSearchParams.mockReturnValue({q: 'title1'})
    const links = createWrapper().find('Link')

    expect(links).toHaveLength(1)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
  })

  it('filteredBySearchSubscriptionsSelector should return second subscription matching query "title2"', () => {
    useSearchParams.mockReturnValue({q: 'title2'})
    const links = createWrapper().find('Link')

    expect(links).toHaveLength(1)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })

  it('filteredBySearchSubscriptionsSelector should return first subscription matching query "TITLE1"', () => {
    useSearchParams.mockReturnValue({q: 'TITLE1'})
    const links = createWrapper().find('Link')

    expect(links).toHaveLength(1)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
  })

  it('filteredBySearchSubscriptionsSelector should return two subscriptions matching query "titl"', () => {
    useSearchParams.mockReturnValue({q: 'titl'})
    const links = createWrapper().find('Link')

    expect(links).toHaveLength(2)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })

  it('filteredBySearchSubscriptionsSelector should return no subscriptions for query "other"', () => {
    useSearchParams.mockReturnValue({q: 'other'})
    const links = createWrapper().find('Link')

    expect(links).toHaveLength(0)
  })
})
