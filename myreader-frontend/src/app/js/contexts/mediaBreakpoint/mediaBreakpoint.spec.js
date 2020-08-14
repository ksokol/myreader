import React from 'react'
import {act} from 'react-dom/test-utils'
import {mount} from 'enzyme'
import {MediaBreakpointProvider} from './MediaBreakpointProvider'
import {useMediaBreakpoint} from '.'

function TestComponent() {
  return JSON.stringify(useMediaBreakpoint())
}

describe('mediaBreakpoint', () => {

  let capturedListener

  const createWrapper = () => {
    return mount(
      <MediaBreakpointProvider>
        <TestComponent />
      </MediaBreakpointProvider>
    )
  }

  beforeEach(() => {
    capturedListener = []

    window.matchMedia = media => ({
      media,
      addListener: fn => capturedListener.push(() => {
        fn({matches: true, media})
      })
    })
  })

  it('should set state "mediaBreakpoint" to "phone"', () => {
    const wrapper = createWrapper()
    act(() =>capturedListener[0]())
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({mediaBreakpoint: 'phone'}))
  })

  it('should set state "mediaBreakpoint" to "tablet"', () => {
    const wrapper = createWrapper()
    act(() =>capturedListener[1]())
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({mediaBreakpoint: 'tablet'}))
  })

  it('should set state "mediaBreakpoint" to "desktop"', () => {
    const wrapper = createWrapper()
    act(() => capturedListener[2]())
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({mediaBreakpoint: 'desktop'}))
  })

  it('should not render prop "children" when current mediaBreakpoint is unknown', () => {
    const wrapper = createWrapper()

    expect(wrapper.html()).toBeNull()
  })
})
