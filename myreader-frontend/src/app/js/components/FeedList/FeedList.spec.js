import React from 'react'
import {shallow} from 'enzyme'
import FeedList from './FeedList'

describe('FeedList', () => {

  let props

  const createComponent = () => shallow(<FeedList {...props} />)

  beforeEach(() => {
    props= {
      feeds: [
        {uuid: '1', title: '1', hasErrors: false, createdAt: '1'},
        {uuid: '2', title: '2', hasErrors: true, createdAt: '2'}
      ],
      navigateTo: jest.fn()
    }
  })

  it('should not render exclamation icon when first feed has no errors', () => {
    expect(createComponent().children().at(0).find('[type="exclamation-triangle"]').exists()).toEqual(false)
  })

  it('should render exclamation icon when second feed has errors', () => {
    expect(createComponent().children().at(1).find('[type="exclamation-triangle"]').exists()).toEqual(true)
  })

  it('should trigger prop function "navigateTo" with first feed', () => {
    createComponent().children().at(0).props().onClick()

    expect(props.navigateTo).toHaveBeenCalledWith({uuid: '1', title: '1', hasErrors: false, createdAt: '1'})
  })

  it('should trigger prop function "navigateTo" with second feed', () => {
    createComponent().children().at(1).props().onClick()

    expect(props.navigateTo).toHaveBeenCalledWith({uuid: '2', title: '2', hasErrors: true, createdAt: '2'})
  })
})
