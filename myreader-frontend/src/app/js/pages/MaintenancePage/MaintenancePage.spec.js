import React from 'react'
import {shallow} from 'enzyme'
import MaintenancePage from './MaintenancePage'
import {Button} from '../../components'

describe('MaintenancePage', () => {

  it('should trigger prop function "onRefreshIndex" when button clicked', () => {
    const props = {
      onRefreshIndex: jest.fn()
    }

    shallow(<MaintenancePage {...props} />).find(Button).props().onClick()

    expect(props.onRefreshIndex).toHaveBeenCalled()
  })
})
