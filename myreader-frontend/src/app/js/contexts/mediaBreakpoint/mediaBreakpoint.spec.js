import React from 'react'
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
    capturedListener[0]()
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({mediaBreakpoint: 'phone'}))
  })

  it('should set state "mediaBreakpoint" to "tablet"', () => {
    const wrapper = createWrapper()
    capturedListener[1]()
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({mediaBreakpoint: 'tablet'}))
  })

  it('should set state "mediaBreakpoint" to "desktop"', () => {
    const wrapper = createWrapper()
    capturedListener[2]()
    wrapper.update()

    expect(wrapper.html()).toEqual(JSON.stringify({mediaBreakpoint: 'desktop'}))
  })
})
