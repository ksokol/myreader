import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import MediaBreakpointContext from './mediaBreakpoint/MediaBreakpointContext'
import SettingsContext from './settings/SettingsContext'
import {SettingsProvider} from './settings/SettingsProvider'
import {MediaBreakpointProvider} from './mediaBreakpoint/MediaBreakpointProvider'
import {HotkeysProvider} from './hotkeys/HotkeysProvider'
import HotkeysContext from './hotkeys/HotkeysContext'
import SecurityContext from './security/SecurityContext'
import {SecurityProvider} from './security/SecurityProvider'

export function AppContextProvider({children}) {
  return (
    <SecurityProvider>
      <HotkeysProvider>
        <SettingsProvider>
          <MediaBreakpointProvider>
            {children}
          </MediaBreakpointProvider>
        </SettingsProvider>
      </HotkeysProvider>
    </SecurityProvider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.any
}

export function withAppContext(WrappedComponent) {
  return props => (
    <SecurityContext.Consumer>
      {security => (
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
                      {...security}
                    />
                  )}
                </SettingsContext.Consumer>
              )}
            </MediaBreakpointContext.Consumer>
          )}
        </HotkeysContext.Consumer>
      )}
    </SecurityContext.Consumer>
  )
}

export function useAppContext() {
  return {
    ...useContext(MediaBreakpointContext),
    ...useContext(SettingsContext),
    ...useContext(HotkeysContext),
    ...useContext(SecurityContext)
  }
}
