import './SidenavLayout.css'
import React, {useEffect, useReducer} from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '../Buttons'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import Navigation from '../Navigation/Navigation'
import {Backdrop} from '../Backdrop/Backdrop'
import {useMediaBreakpoint} from '../../contexts/mediaBreakpoint'

function reducer(state, action) {
  let newState = state

  switch(action.type) {
  case 'toggle': {
    if (!state.isDesktop) {
      newState = {
        ...state,
        backdropVisible: !state.backdropVisible,
        sidenavSlideIn: !state.sidenavSlideIn,
      }
    }
    break
  }
  case 'change': {
    if (action.isDesktop && state.mediaBreakpoint !== action.mediaBreakpoint) {
      newState = {
        ...state,
        backdropVisible: false,
        sidenavSlideIn: false,
        mediaBreakpoint: action.mediaBreakpoint,
        isDesktop: action.isDesktop,
      }
    }

    if (!action.isDesktop && state.isDesktop) {
      newState = {
        ...state,
        backdropVisible: false,
        sidenavSlideIn: false,
        mediaBreakpoint: action.mediaBreakpoint,
        isDesktop: action.isDesktop,
      }
    }
    break
  }
  case 'hide': {
    newState = {
      ...state,
      backdropVisible: false,
      sidenavSlideIn: false,
    }
    break
  }
  }
  return newState
}

function Component({children}) {
  const {mediaBreakpoint, isDesktop} = useMediaBreakpoint()

  const [state, dispatch] = useReducer(reducer, {
    backdropVisible: false,
    sidenavSlideIn: false,
    mediaBreakpoint,
    isDesktop,
  })

  useEffect(() => {
    dispatch({type: 'change', mediaBreakpoint, isDesktop})
  },[mediaBreakpoint, isDesktop])

  const classes = [
    'my-sidenav-layout__nav',
    state.sidenavSlideIn ? 'my-sidenav-layout__nav--open': '',
    isDesktop ? '': 'my-sidenav-layout__nav--animate'
  ]

  return (
    <div
      className='my-sidenav-layout'
    >
      <header
        className='my-sidenav-layout__header'
      >
        {!isDesktop && (
          <IconButton
            type='bars'
            onClick={() => dispatch({type: 'toggle'})}
            inverse
          />
        )}
      </header>

      <nav
        className={classes.join(' ')}
      >
        <Navigation
          onClick={() => dispatch({type: 'toggle'})}
        />
      </nav>

      <main
        className='my-sidenav-layout__main'
      >{children}
      </main>

      <Backdrop
        maybeVisible={state.backdropVisible}
        onClick={() => dispatch({type: 'hide'})}
      />
    </div>
  )
}

Component.propTypes = {
  children: PropTypes.any
}

export const SidenavLayout = withLocationState(Component)
