import React from 'react'
import {shallow} from 'enzyme'
import FeedListPage from './FeedListPage'

describe('FeedListPage', () => {

  let props

  const createComponent = () => shallow(<FeedListPage {...props} />)

  beforeEach(() => {
    props = {
      feeds: [
        {uuid: '1', title: '1', hasErrors: false, createdAt: '1'}
      ],
      onRefresh: jest.fn()
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      onRefresh: props.onRefresh,
      listPanel: {
        props: {
          feeds: [{uuid: '1', title: '1', hasErrors: false, createdAt: '1'}]
        }
      }
    })
  })
})
