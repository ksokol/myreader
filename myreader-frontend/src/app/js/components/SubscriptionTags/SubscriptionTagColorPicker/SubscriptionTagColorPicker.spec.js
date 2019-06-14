import React from 'react'
import {shallow} from 'enzyme'
import {SubscriptionTagColorPicker} from './SubscriptionTagColorPicker'
import {Badge, Button, ColorPicker, Dialog} from '../../../components'

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

describe('SubscriptionTagColorPicker', () => {

  let props, dialog

  beforeEach(() => {
    props = {
      tag: {
        name: 'expected name',
        color: 'expected color'
      },
      onSave: jest.fn(),
      onClose: jest.fn()
    }

    dialog = new DialogPage(shallow(<SubscriptionTagColorPicker {...props} />))
  })

  it('should render dialog header', () => {
    expect(dialog.header.type).toEqual(Badge)
    expect(dialog.header.props).toEqual({
      text: 'expected name',
      color: 'expected color'
    })
  })

  it('should render dialog body', () => {
    expect(dialog.body.type).toEqual(ColorPicker)
    expect(dialog.body.props).toContainObject({
      color: 'expected color'
    })
  })

  it('should render dialog footer', () => {
    expect(dialog.footer.type).toEqual(Button)
    expect(dialog.footer.props).toContainObject({
      children: 'save',
      primary: true
    })
  })

  it('should change dialog header prop "color" when color changed', () => {
    dialog.body.props.onChange('changed color')

    expect(dialog.header.props).toEqual({
      text: 'expected name',
      color: 'changed color'
    })
  })

  it('should not trigger prop functions "onClose" and "onSave" when only color changed', () => {
    dialog.body.props.onChange('changed color')

    expect(props.onSave).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it('should not trigger prop function "onSave" but prop function "onClose" when save button clicked but color does not changed', () => {
    dialog.body.props.onChange('expected color')

    expect(props.onSave).not.toHaveBeenCalled()
    expect(props.onClose).not.toHaveBeenCalled()
  })

  it('should trigger prop function "onClose" but not prop function "onSave" when dialog close button clicked', () => {
    dialog.self.props().onClickClose()

    expect(props.onSave).not.toHaveBeenCalled()
    expect(props.onClose).toHaveBeenCalled()
  })

  it('should trigger prop function "onSave" and prop function "onClose" when color changed and save button clicked', () => {
    dialog.body.props.onChange('changed color')
    dialog.footer.props.onClick()

    expect(props.onSave).toHaveBeenCalledWith('changed color')
    expect(props.onClose).toHaveBeenCalled()
  })
})
