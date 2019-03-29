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
      ]
    }
  })

  it('should pass expected props', () => {
    expect(createComponent().first().props()).toContainObject({
      listPanel: {
        props: {
          feeds: [{uuid: '1', title: '1', hasErrors: false, createdAt: '1'}]
        }
      }
    })
  })
})
