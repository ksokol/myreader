import React from 'react'
import {mount} from 'enzyme'
import {HotkeysProvider} from './HotkeysProvider'
import HotkeysContext from './HotkeysContext'

class Component extends React.Component {
  static contextType = HotkeysContext
  render = () => 'wrapped component'
}

describe('hotkeys context', () => {

  let wrapper

  const createWrapper = () =>
    mount(
      <HotkeysProvider>
        <Component />
      </HotkeysProvider>
    )

  beforeEach(() => {
    wrapper = createWrapper()
  })

  const onKey = key => {
    document.dispatchEvent(new KeyboardEvent('keyup', {key}))
  }

  it('should render wrapped element', () => {
    expect(wrapper.find(Component).text()).toEqual('wrapped component')
  })

  it('should pass expected context when key "z" pressed', () => {
    onKey('z')

    expect(wrapper.find(Component).instance().context).toEqual(expect.objectContaining({
      hotkey: 'z',
      hotkeysStamp: 1
    }))
  })

  it('should pass expected context when subsequent key "y" pressed', () => {
    onKey('z')
    onKey('y')

    expect(wrapper.find(Component).instance().context).toEqual(expect.objectContaining({
      hotkey: 'y',
      hotkeysStamp: 2
    }))
  })
})
