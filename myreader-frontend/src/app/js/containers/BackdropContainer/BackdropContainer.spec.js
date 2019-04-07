import React from 'react'
import {mount} from 'enzyme'
import BackdropContainer from './BackdropContainer'

/* eslint-disable react/prop-types */
jest.mock('../../components', () => ({
  Backdrop: () => null
}))
/* eslint-enable */

describe('BackdropContainer', () => {

  let state, dispatch

  const createWrapper = () => {
    return mount(<BackdropContainer dispatch={dispatch} {...state} />).find('Backdrop')
  }

  beforeEach(() => {
    dispatch = jest.fn()

    state = {
      common: {
        backdropVisible: true
      }
    }
  })

  it('should pass expected props', () => {
    expect(createWrapper().props()).toContainObject({
      isBackdropVisible: true
    })
  })

  it('should dispatch action when prop function "onClick" triggered', () => {
    createWrapper().props().onClick()

    expect(dispatch).toHaveBeenCalledWith({
      type: 'HIDE_BACKDROP'
    })
  })
})
