import React from 'react'
import {mount} from 'enzyme'
import {HotkeysProvider} from './HotkeysProvider'
import {useHotkeys} from '.'

function TestComponent() {
  return JSON.stringify(useHotkeys())
}

describe('hotkeys context', () => {

  let wrapper

  const createWrapper = () =>
    mount(
      <HotkeysProvider>
        <TestComponent />
      </HotkeysProvider>
    )

  beforeEach(() => {
    wrapper = createWrapper()
  })

  const onKey = key => {
    document.dispatchEvent(new KeyboardEvent('keyup', {key}))
    wrapper.update()
  }

  it('should pass expected context when key "z" pressed', () => {
    onKey('z')

    expect(wrapper.html()).toEqual(JSON.stringify({
      hotkeysStamp: 1,
      hotkey: 'z'
    }))
  })

  it('should pass expected context when subsequent key "y" pressed', () => {
    onKey('z')
    onKey('y')

    expect(wrapper.html()).toEqual(JSON.stringify({
      hotkeysStamp: 2,
      hotkey: 'y',
    }))
  })
})
