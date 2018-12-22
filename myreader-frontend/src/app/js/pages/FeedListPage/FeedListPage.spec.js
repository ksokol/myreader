import React from 'react'
import {shallow} from 'enzyme'
import FeedListPage from './FeedListPage'

describe('FeedListPage', () => {

  let props

  const createComponent = () => shallow(<FeedListPage {...props} />)

  beforeEach(() => {
    props = {
      router: {
        query: {
          a: 'b'
        }
      },
      feeds: [
        {uuid: '1', title: '1', hasErrors: false, createdAt: '1'}
      ],
      onSearchChange: jest.fn(),
      onRefresh: jest.fn(),
      navigateTo: jest.fn()
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      router: {query: {a: 'b'}},
      onSearchChange: props.onSearchChange,
      onRefresh: props.onRefresh,
      listPanel: {
        props: {
          feeds: [{uuid: '1', title: '1', hasErrors: false, createdAt: '1'}],
          navigateTo: props.navigateTo
        }
      }
    })
  })
})
