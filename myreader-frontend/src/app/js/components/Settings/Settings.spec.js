import React from 'react'
import {shallow} from 'enzyme'
import {Settings} from '.'
import Option from './Option/Option'

describe('Settings', () => {

  let props

  const createOptions = () => shallow(<Settings {...props} />).find(Option)

  beforeEach(() => {
    props = {
      settings: {
        pageSize: 30,
        showUnseenEntries: true,
        showEntryDetails: false
      },
      onChange: jest.fn()
    }
  })

  it('should create option component for every setting in prop "settings"', () => {
    const options = createOptions()

    expect(options.at(0).props()).toContainObject({
      value: 30,
      options: [10, 20, 30]
    })
    expect(options.at(1).props()).toContainObject({
      value: true,
      options: [{label: 'show', value: false}, {label: 'hide', value: true}]
    })
    expect(options.at(2).props()).toContainObject({
      value: false,
      options: [{label: 'show', value: true}, {label: 'hide', value: false}]
    })
  })

  it('should trigger prop function "onChange" with changed pageSize option', () => {
    const expectedSettings = {...props.settings, pageSize: 10}

    createOptions().at(0).props().onSelect(10)
    expect(props.onChange).toHaveBeenCalledWith(expectedSettings)
  })

  it('should trigger prop function "onChange" with changed showUnseenEntries option', () => {
    const expectedSettings = {...props.settings, showUnseenEntries: false}

    createOptions().at(1).props().onSelect(false)
    expect(props.onChange).toHaveBeenCalledWith(expectedSettings)
  })

  it('should trigger prop function "onChange" with changed showEntryDetails option', () => {
    const expectedSettings = {...props.settings, showEntryDetails: true}

    createOptions().at(2).props().onSelect(true)
    expect(props.onChange).toHaveBeenCalledWith(expectedSettings)
  })
})
