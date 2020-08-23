import React from 'react'
import {mount} from 'enzyme'
import {SubscriptionListPage} from './SubscriptionListPage'
import SubscriptionContext from '../../contexts/subscription/SubscriptionContext'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionList: () => null,
}))

jest.mock('../../components/ListLayout/ListLayout', () => ({
  ListLayout: ({listPanel}) => <div>{listPanel}</div>,
}))
/* eslint-enable */

describe('SubscriptionListPage', () => {

  let props

  const createWrapper = () => mount(
    <SubscriptionContext.Provider value={props}>
      <SubscriptionListPage {...props} />
    </SubscriptionContext.Provider>
  )

  beforeEach(() => {
    props = {
      subscriptions: [
        {uuid: '1', title: 'title1'},
        {uuid: '2', title: 'title2'}
      ]
    }
  })

  it('should initialize list panel component with given props', () => {
    expect(createWrapper().find('SubscriptionList').props()).toEqual({
      subscriptions: [
        {uuid: '1', title: 'title1'},
        {uuid: '2', title: 'title2'}
      ]
    })
  })
})
