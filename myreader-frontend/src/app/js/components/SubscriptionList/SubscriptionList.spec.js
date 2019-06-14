import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionList from './SubscriptionList'
import {SUBSCRIPTIONS_URL} from '../../constants'

/* eslint-disable react/prop-types */
jest.mock('../../contexts', () => ({
  withLocationState: Component => Component
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
      searchParams: {}
    }
  })

  it('should pass prop "to" to link component', () => {
    const links = createWrapper().find('Link')

    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })

  it('filteredBySearchSubscriptionsSelector should return first subscription matching query "title1"', () => {
    props.searchParams.q = 'title1'
    const links = createWrapper().find('Link')

    expect(links.length).toEqual(1)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
  })

  it('filteredBySearchSubscriptionsSelector should return second subscription matching query "title2"', () => {
    props.searchParams.q = 'title2'
    const links = createWrapper().find('Link')

    expect(links.length).toEqual(1)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })

  it('filteredBySearchSubscriptionsSelector should return first subscription matching query "TITLE1"', () => {
    props.searchParams.q = 'TITLE1'
    const links = createWrapper().find('Link')

    expect(links.length).toEqual(1)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
  })

  it('filteredBySearchSubscriptionsSelector should return two subscriptions matching query "titl"', () => {
    props.searchParams.q = 'titl'
    const links = createWrapper().find('Link')

    expect(links.length).toEqual(2)
    expect(links.at(0).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/1`)
    expect(links.at(1).prop('to')).toEqual(`${SUBSCRIPTIONS_URL}/2`)
  })

  it('filteredBySearchSubscriptionsSelector should return no subscriptions for query "other"', () => {
    props.searchParams.q = 'other'
    const links = createWrapper().find('Link')

    expect(links.length).toEqual(0)
  })
})
