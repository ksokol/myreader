import React from 'react'
import {shallow} from 'enzyme'
import {Maintenance} from '.'
import {Button} from '..'

describe('Maintenance', () => {

  it('should trigger prop function "onRefreshIndex" when button clicked', () => {
    const props = {
      onRefreshIndex: jest.fn()
    }

    shallow(<Maintenance {...props} />).find(Button).props().onClick()

    expect(props.onRefreshIndex).toHaveBeenCalled()
  })
})
