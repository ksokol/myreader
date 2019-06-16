import React from 'react'
import {mount} from 'enzyme'
import {MediaBreakpointProvider} from './MediaBreakpointProvider'
import MediaBreakpointContext from './MediaBreakpointContext'

class TestComponent extends React.Component {
  static contextType = MediaBreakpointContext
  render = () => null
}

describe('mediaBreakpoint', () => {

  let originalMatchMediaFn, mediaMatchListeners

  const createTestComponent = () => {
    return mount(
      <MediaBreakpointProvider>
        <TestComponent />
      </MediaBreakpointProvider>
    ).find(TestComponent).instance()
  }

  beforeEach(() => {
    mediaMatchListeners = []
    originalMatchMediaFn = window.matchMedia

    window.matchMedia = media => ({
      media,
      addListener: fn => mediaMatchListeners.push(() => fn({matches: true, media}))
    })

    expect(mediaMatchListeners).toHaveLength(0)
  })

  afterEach(() => window.matchMedia = originalMatchMediaFn)

  it('should set state "mediaBreakpoint" to "phone" when media breakpoint is set to "phone"', () => {
    const component = createTestComponent()
    mediaMatchListeners[0]()

    expect(component.context).toEqual({mediaBreakpoint: 'phone'})
  })

  it('should set state "mediaBreakpoint" to "tablet" when media breakpoint is set to "tablet"', () => {
    const component = createTestComponent()
    mediaMatchListeners[1]()

    expect(component.context).toEqual({mediaBreakpoint: 'tablet'})
  })

  it('should set state "mediaBreakpoint" to "desktop" when media breakpoint is set to "desktop"', () => {
    const component = createTestComponent()
    mediaMatchListeners[2]()

    expect(component.context).toEqual({mediaBreakpoint: 'desktop'})
  })
})
