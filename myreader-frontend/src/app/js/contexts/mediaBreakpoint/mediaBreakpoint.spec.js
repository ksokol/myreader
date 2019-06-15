import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {MediaBreakpointProvider} from './MediaBreakpointProvider'
import MediaBreakpointContext from './MediaBreakpointContext'
import {createMockStore} from '../../shared/test-utils'

class TestComponent extends React.Component {
  static contextType = MediaBreakpointContext
  render = () => null
}

describe('mediaBreakpoint', () => {

  let store, originalMatchMediaFn, mediaMatchListeners

  const createTestComponent = () => {
    return mount(
      <Provider store={store}>
        <MediaBreakpointProvider>
          <TestComponent />
        </MediaBreakpointProvider>
      </Provider>
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
    store = createMockStore()
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

  describe('Redux store', () => {

    it('should dispatch action with media breakpoint set to "phone"', () => {
      createTestComponent()
      mediaMatchListeners[0]()

      expect(store.getActions()[0]).toEqual({type: 'MEDIA_BREAKPOINT_CHANGED', mediaBreakpoint: 'phone'})
    })

    it('should dispatch action with media breakpoint set to "tablet"', () => {
      createTestComponent()
      mediaMatchListeners[1]()

      expect(store.getActions()[0]).toEqual({type: 'MEDIA_BREAKPOINT_CHANGED', mediaBreakpoint: 'tablet'})
    })


    it('should dispatch action with media breakpoint set to "desktop"', () => {
      createTestComponent()
      mediaMatchListeners[2]()

      expect(store.getActions()[0]).toEqual({type: 'MEDIA_BREAKPOINT_CHANGED', mediaBreakpoint: 'desktop'})
    })
  })
})
