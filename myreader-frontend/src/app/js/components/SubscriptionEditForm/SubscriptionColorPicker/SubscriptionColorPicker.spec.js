import React from 'react'
import {shallow} from 'enzyme'
import {SubscriptionColorPicker} from './SubscriptionColorPicker'
import Dialog from '../../Dialog/Dialog'
import ColorPicker from '../../ColorPicker/ColorPicker'

class DialogPage {

  constructor(wrapper) {
    this.wrapper = wrapper
  }

  get self() {
    return this.wrapper.find(Dialog)
  }

  get header() {
    return this.self.prop('header')
  }

  get body() {
    return this.self.prop('body')
  }

  get footer() {
    return this.self.prop('footer')
  }
}

describe('SubscriptionColorPicker', () => {

  let props, dialog

  beforeEach(() => {
    props = {
      color: 'expected color',
      onSelect: jest.fn(),
      onClose: jest.fn()
    }

    dialog = new DialogPage(shallow(<SubscriptionColorPicker {...props} />))
  })

  it('should not trigger prop function "onSelect" but prop function "onClose" when save button clicked but color does not changed', () => {
    dialog.body.props.onChange('expected color')

    expect(props.onSelect).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it('should trigger prop function "onClose" but not prop function "onSelect" when dialog close button clicked', () => {
    dialog.self.props().onClickClose()

    expect(props.onSelect).not.toHaveBeenCalled()
    expect(props.onClose).toHaveBeenCalled()
  })
})
