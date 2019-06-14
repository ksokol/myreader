import React from 'react'
import {mount} from 'enzyme'
import SubscriptionListPage from './SubscriptionListPage'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  SubscriptionList: () => null,
  ListLayout: ({listPanel}) => <div>{listPanel}</div>
}))
/* eslint-enable */

describe('SubscriptionListPage', () => {

  let state, props

  const createWrapper = () => mount(<SubscriptionListPage {...props} state={state} />)

  beforeEach(() => {
    state = {
      subscription: {
        subscriptions: [
          {uuid: '1', title: 'title1'},
          {uuid: '2', title: 'title2'}
        ]
      }
    }

    props = {
      searchParams: {
        q: ''
      }
    }
  })

  it('should initialize list panel component with given props', () => {
    expect(createWrapper().find('ListLayout').props()).toContainObject({
      listPanel: {
        props: {
          subscriptions: [
            {uuid: '1', title: 'title1'},
            {uuid: '2', title: 'title2'}
          ]
        }
      }
    })
  })
})
