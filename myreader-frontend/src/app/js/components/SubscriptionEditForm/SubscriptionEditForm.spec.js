import React from 'react'
import {shallow} from 'enzyme'
import SubscriptionEditForm from './SubscriptionEditForm'

/* eslint-disable react/prop-types */
jest.mock('./SubscriptionExclusions/SubscriptionExclusions', () => ({
  SubscriptionExclusions: () => null
}))
/* eslint-enable */

describe('SubscriptionEditForm', () => {

  let props

  const createWrapper = () => shallow(<SubscriptionEditForm {...props} />)

  beforeEach(() => {
    props = {
      data: {
        uuid: 'uuid1',
        title: 'title1',
        origin: 'origin1',
        tag: 'name 1',
        color: '#FF11FF',
        createdAt: '2017-12-29'
      },
      subscriptionTags: [
        'name 1',
        'name 2'
      ],
      validations: [
        {field: 'title', defaultMessage: 'validation message'}
      ],
      changePending: true,
      saveSubscriptionEditForm: jest.fn(),
      deleteSubscription: jest.fn()
    }
  })

  it('should pass expected props to subscription fetch errors component', () => {
    expect(createWrapper().find('SubscriptionFetchErrors').props()).toEqual({
      uuid: 'uuid1',
    })
  })
})
