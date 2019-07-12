import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import MediaBreakpointContext from './mediaBreakpoint/MediaBreakpointContext'
import SettingsContext from './settings/SettingsContext'
import {SettingsProvider} from './settings/SettingsProvider'
import {MediaBreakpointProvider} from './mediaBreakpoint/MediaBreakpointProvider'
import {HotkeysProvider} from './hotkeys/HotkeysProvider'
import HotkeysContext from './hotkeys/HotkeysContext'
import {SubscriptionProvider} from './subscription/SubscriptionProvider'
import SubscriptionContext from './subscription/SubscriptionContext'

export function AppContextProvider({children}) {
  return (
    <HotkeysProvider>
      <SettingsProvider>
        <MediaBreakpointProvider>
          <SubscriptionProvider>
            {children}
          </SubscriptionProvider>
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
                <SubscriptionContext.Consumer>
                  {subscriptions => (
                    <WrappedComponent
                      {...props}
                      {...mediaBreakpoint}
                      {...settings}
                      {...hotkeys}
                      {...subscriptions}
                    />
                  )}
                </SubscriptionContext.Consumer>
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
    ...useContext(HotkeysContext),
    ...useContext(SubscriptionContext)
  }
}
