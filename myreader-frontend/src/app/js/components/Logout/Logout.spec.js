import React from 'react'
import {mount} from 'enzyme'
import Logout from './Logout'

describe('Logout', () => {

  it('should redirect to login page', () => {
    const props = {
      history: {
        replace: jest.fn()
      }
    }

    mount(<Logout {...props} />)

    expect(props.history.replace).toHaveBeenCalledWith({route: ['login'], url: '!/login'})
  })
})
