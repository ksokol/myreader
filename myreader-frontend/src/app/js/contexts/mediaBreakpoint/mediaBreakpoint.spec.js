import React from 'react'
import {mount} from 'enzyme'
import {MediaBreakpointProvider} from './MediaBreakpointProvider'
import MediaBreakpointContext from './MediaBreakpointContext'

class TestComponent extends React.Component {
  static contextType = MediaBreakpointContext
  render = () => 'expected component'
}

describe('mediaBreakpoint', () => {

  let mediaMatchListeners

  const createWrapper = () => {
    return mount(
      <MediaBreakpointProvider>
        <TestComponent />
      </MediaBreakpointProvider>
    ).find(TestComponent)
  }

  beforeEach(() => {
    mediaMatchListeners = []

    window.matchMedia = media => ({
      media,
      addListener: fn => mediaMatchListeners.push(() => fn({matches: true, media}))
    })
  })

  it('should render children', () => {
    expect(createWrapper().html()).toEqual('expected component')
  })

  it('should set state "mediaBreakpoint" to "phone" when media breakpoint is set to "phone"', () => {
    const component = createWrapper()
    mediaMatchListeners[0]()

    expect(component.instance().context).toEqual({mediaBreakpoint: 'phone'})
  })

  it('should set state "mediaBreakpoint" to "tablet" when media breakpoint is set to "tablet"', () => {
    const component = createWrapper()
    mediaMatchListeners[1]()

    expect(component.instance().context).toEqual({mediaBreakpoint: 'tablet'})
  })

  it('should set state "mediaBreakpoint" to "desktop" when media breakpoint is set to "desktop"', () => {
    const component = createWrapper()
    mediaMatchListeners[2]()

    expect(component.instance().context).toEqual({mediaBreakpoint: 'desktop'})
  })
})
