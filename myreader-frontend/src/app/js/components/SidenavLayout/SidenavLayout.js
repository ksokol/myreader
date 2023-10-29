import './SidenavLayout.css'
import {useEffect, useReducer, useRef, useLayoutEffect} from 'react'
import {IconButton} from '../Buttons'
import {Navigation} from '../Navigation/Navigation'
import {Backdrop} from './Backdrop/Backdrop'
import {useMediaBreakpoint} from './mediaBreakpoint'
import {useRouter} from '../../contexts/router'

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

export function SidenavLayout({children}) {
  const mainRef = useRef()
  const {route} = useRouter()
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

  useLayoutEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [route.pathname, mainRef])

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
            role='navigation-menu-button'
            onClick={() => dispatch({type: 'toggle'})}
            inverse
          />
        )}
        <div id='portal-header' />
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
        ref={mainRef}
      >{children}
      </main>

      <Backdrop
        maybeVisible={state.backdropVisible}
        onClick={() => dispatch({type: 'hide'})}
      />
    </div>
  )
}
