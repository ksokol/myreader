import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import MediaBreakpointContext from './mediaBreakpoint/MediaBreakpointContext'
import SettingsContext from './settings/SettingsContext'
import {SettingsProvider} from './settings/SettingsProvider'
import {MediaBreakpointProvider} from './mediaBreakpoint/MediaBreakpointProvider'
import {HotkeysProvider} from './hotkeys/HotkeysProvider'
import HotkeysContext from './hotkeys/HotkeysContext'

export function AppContextProvider({children}) {
  return (
    <HotkeysProvider>
      <SettingsProvider>
        <MediaBreakpointProvider>
          {children}
        </MediaBreakpointProvider>
      </SettingsProvider>
    </HotkeysProvider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.any
}

export function withAppContext(WrappedComponent) {
  return props => (
    <HotkeysContext.Consumer>
      {hotkeys => (
        <MediaBreakpointContext.Consumer>
          {mediaBreakpoint => (
            <SettingsContext.Consumer>
              {settings => (
                <WrappedComponent
                  {...props}
                  {...mediaBreakpoint}
                  {...settings}
                  {...hotkeys}
                />
              )}
            </SettingsContext.Consumer>
          )}
        </MediaBreakpointContext.Consumer>
      )}
    </HotkeysContext.Consumer>
  )
}

export function useAppContext() {
  return {
    ...useContext(MediaBreakpointContext),
    ...useContext(SettingsContext),
    ...useContext(HotkeysContext)
  }
}
