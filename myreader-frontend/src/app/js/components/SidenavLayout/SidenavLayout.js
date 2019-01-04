import './SidenavLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {UIView} from '@uirouter/react'
import {IconButton} from '..'
import {BackdropContainer, NavigationContainer} from '../../containers'

const SidenavLayout = props => {
  const {
    isDesktop,
    sidenavSlideIn,
    toggleSidenav
  } = props

  const classes = classNames(
    'my-sidenav-layout__nav',
    {'my-sidenav-layout__nav--open': sidenavSlideIn},
    {'my-sidenav-layout__nav--animate': !isDesktop}
  )

  return (
    <div className='my-sidenav-layout'>
      <header className='my-sidenav-layout__header'>
        {!isDesktop && <IconButton type='bars' onClick={toggleSidenav} inverse/>}
      </header>

      <nav className={classes}>
        <NavigationContainer/>
      </nav>

      <main className='my-sidenav-layout__main'>
        <UIView/>
      </main>

      <BackdropContainer/>
    </div>
  )
}

SidenavLayout.propTypes = {
  isDesktop: PropTypes.bool.isRequired,
  sidenavSlideIn: PropTypes.bool.isRequired,
  toggleSidenav: PropTypes.func.isRequired
}

export default SidenavLayout
