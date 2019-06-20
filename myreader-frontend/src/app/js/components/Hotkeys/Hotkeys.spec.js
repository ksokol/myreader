import React from 'react'
import Hotkeys from './Hotkeys'
import {mount} from 'enzyme'

const enter = {key: 'enter', code: 13}
const down = {key: 'down', code: 40}
const up = {key: 'up', code: 38}
const a = {key: 'a', code: 65}
const y = {key: 'y', code: 89}
const z = {key: 'z', code: 90}
const esc = {key: 'esc', code: 27}

describe('Hotkeys', () => {

  let onKeys, wrapper

  beforeEach(() => {
    onKeys = {
      z: jest.fn(),
      y: jest.fn(),
      enter: jest.fn(),
      down: jest.fn(),
      up: jest.fn(),
      esc: jest.fn()
    }

    wrapper = mount(<Hotkeys onKeys={onKeys}><p>wrapped component</p></Hotkeys>)
  })

  const onKey = ({key, code}) => {
    document.dispatchEvent(new KeyboardEvent('keyup', {key, code}))
  }

  it('should render wrapped element', () => {
    expect(wrapper.find('p').text()).toEqual('wrapped component')
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
