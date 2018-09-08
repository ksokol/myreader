import React from 'react'
import Hotkeys from './hotkeys'
import ReactTestUtils from 'react-dom/test-utils'
import {dispatchKeyEventOnElement} from '../../shared/test-utils'

const enter = {key: 'Enter', keyCode: 13}
const down = {key: 'ArrowDown', keyCode: 40}
const up = {key: 'ArrowUp', keyCode: 38}
const a = {key: 'a', keyCode: 65}
const y = {key: 'y', keyCode: 89}
const z = {key: 'z', keyCode: 90}
const esc = {key: 'esc', keyCode: 27}

describe('src/app/js/components/hotkeys/hotkeys.spec.js', () => {

  let onKeys, instance

  beforeEach(() => {
    onKeys = {
      z: jest.fn(),
      y: jest.fn(),
      enter: jest.fn(),
      down: jest.fn(),
      up: jest.fn(),
      esc: jest.fn()
    }

    instance = ReactTestUtils.renderIntoDocument(<Hotkeys onKeys={onKeys}><wrapped-element/></Hotkeys>)
  })

  const onKey = (event, funcs = {}) => dispatchKeyEventOnElement(instance.myRef.current, {type: 'press', event, funcs})

  it('should render wrapped element', () => {
    expect(instance.props.children.type).toEqual('wrapped-element')
  })

  it('should call function mapped to "z" key', () => {
    onKey(z)

    expect(onKeys.z).toHaveBeenCalledWith()
    expect(onKeys.y).not.toHaveBeenCalledWith()
  })

  it('should call function mapped to "y" key', () => {
    onKey(y)

    expect(onKeys.z).not.toHaveBeenCalledWith()
    expect(onKeys.y).toHaveBeenCalledWith()
  })

  it('should not call any mapped function when key is not registered', () => {
    onKey(a)

    expect(onKeys.z).not.toHaveBeenCalledWith()
    expect(onKeys.y).not.toHaveBeenCalledWith()
  })

  it('should call function mapped to "enter" key', () => {
    onKey(enter)

    expect(onKeys.enter).toHaveBeenCalledWith()
  })

  it('should call function mapped to "down" key', () => {
    onKey(down)

    expect(onKeys.down).toHaveBeenCalledWith()
  })

  it('should call function mapped to "up" key', () => {
    onKey(up)

    expect(onKeys.up).toHaveBeenCalledWith()
  })

  it('should call function mapped to "esc" key', () => {
    onKey(esc)

    expect(onKeys.esc).toHaveBeenCalledWith()
  })
})
