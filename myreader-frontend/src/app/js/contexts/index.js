import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import MediaBreakpointContext from './mediaBreakpoint/MediaBreakpointContext'
import SettingsContext from './settings/SettingsContext'
import {SettingsProvider} from './settings/SettingsProvider'
import {MediaBreakpointProvider} from './mediaBreakpoint/MediaBreakpointProvider'

export function AppContextProvider({children}) {
  return (
    <SettingsProvider>
      <MediaBreakpointProvider>
        {children}
      </MediaBreakpointProvider>
    </SettingsProvider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.any
}

export function withAppContext(WrappedComponent) {
  return props => (
    <MediaBreakpointContext.Consumer>
      {mediaBreakpoint => (
        <SettingsContext.Consumer>
          {settings => (
            <WrappedComponent
              {...props}
              {...mediaBreakpoint}
              {...settings}
            />
          )}
        </SettingsContext.Consumer>
      )}
    </MediaBreakpointContext.Consumer>
  )
}

export function useAppContext() {
  return {
    ...useContext(MediaBreakpointContext),
    ...useContext(SettingsContext)
  }
}
