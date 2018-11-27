import React from 'react'
import {shallow} from 'enzyme'
import Toast from './Toast'

describe('Toast', () => {

  let props

  const createComponent = () => shallow(<Toast {...props} />)

  beforeEach(() => {
    props = {
      removeNotification: jest.fn()
    }
  })

  it('should not render component when prop "notification" is empty', () => {
    expect(createComponent().find('.my-toast').exists()).toEqual(false)
  })

  it('should render component when prop "notification" is not empty', () => {
    props.notifications = [{id: 1, text: '', type: ''}]
    expect(createComponent().find('.my-toast').exists()).toEqual(true)
  })

  it('should render three notifications in reverse order', () => {
    props.notifications = [
      {id: 1, text: 'text1', type: 'success'},
      {id: 2, text: 'text2', type: 'success'},
      {id: 3, text: 'text3', type: 'error'},
      {id: 4, text: 'text4', type: 'success'}
    ]

    const notifications = createComponent().find('.my-toast__item')

    expect(notifications.length).toEqual(3)
    expect(notifications.at(0).props()).toContainObject({children: 'text4', className: 'my-toast__item'})
    expect(notifications.at(1).props()).toContainObject({children: 'text3', className: 'my-toast__item my-toast__item--error'})
    expect(notifications.at(2).props()).toContainObject({children: 'text2', className: 'my-toast__item'})
  })

  it('should trigger prop function "removeNotification" when notification clicked', () => {
    props.notifications = [{id: 1, text: 'expected text', type: 'expected type'}]
    createComponent().find('.my-toast__item').at(0).props().onClick()

    expect(props.removeNotification).toHaveBeenCalledWith({id: 1, text: 'expected text', type: 'expected type'})
  })
})
