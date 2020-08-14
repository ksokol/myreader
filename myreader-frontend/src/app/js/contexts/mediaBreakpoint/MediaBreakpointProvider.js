import React, {useCallback, useEffect, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import MediaBreakpointContext from './MediaBreakpointContext'
import {breakPoints} from './breakPoints'

export function MediaBreakpointProvider({children}) {
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
    Object
      .values(mediaQueryList)
      .forEach(({mql}) => {
        mql.addListener(handleMediaBreakpointChange)
        handleMediaBreakpointChange(mql)
      })

    return () => {
      Object
        .values(mediaQueryList)
        .forEach(({mql}) => mql.removeListener(handleMediaBreakpointChange))
    }
  }, [mediaQueryList, handleMediaBreakpointChange])

  return mediaBreakpoint !== '' ? (
    <MediaBreakpointContext.Provider value={{mediaBreakpoint}}>
      {children}
    </MediaBreakpointContext.Provider>
  ) : null
}

MediaBreakpointProvider.propTypes = {
  children: PropTypes.any
}
