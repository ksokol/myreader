import {useCallback, useEffect, useMemo, useState} from 'react'
import {supportedBreakpoints} from '../../constants'

function breakPoints() {
  const mediaQueryList = createMediaQueryList()

  return {
    mediaQueryList,
    mediaBreakpointNames: breakPointNames(mediaQueryList)
  }
}

function createMediaQueryList() {
  const mediaQueryLists = {}
  for (const [name, mediaQueryString] of Object.entries(supportedBreakpoints())) {
    const mql = window.matchMedia(mediaQueryString)
    mediaQueryLists[mql.media] = {name, mql}
  }
  return mediaQueryLists
}

function breakPointNames(mediaQueryList) {
  return Object.values(mediaQueryList).map(query => query.name)
}

export function useMediaBreakpoint() {
  const {mediaQueryList, mediaBreakpointNames} = useMemo(breakPoints, [])
  const [mediaBreakpoint, setMediaBreakPoint] = useState('')

  const handleMediaBreakpointChange = useCallback(event => {
    if (!event.matches) {
      return
    }
    const found = mediaBreakpointNames.find(name => name === mediaQueryList[event.media].name)
    if (found) {
      setMediaBreakPoint(found)
    }
  }, [setMediaBreakPoint, mediaQueryList, mediaBreakpointNames])

  useEffect(() => {
    for (const {mql} of Object.values(mediaQueryList)) {
      mql.addEventListener('change', handleMediaBreakpointChange)
      handleMediaBreakpointChange(mql)
    }

    return () => {
      for (const {mql} of Object.values(mediaQueryList)) {
        mql.removeEventListener('change', handleMediaBreakpointChange)
      }
    }
  }, [mediaQueryList, handleMediaBreakpointChange])

  return {
    mediaBreakpoint,
    isDesktop: mediaBreakpoint === 'desktop'
  }
}
