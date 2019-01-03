import './withSidenav.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {connect} from 'react-redux'
import {IconButton} from '..'
import {BackdropContainer, NavigationContainer} from '../../containers'
import {mediaBreakpointIsDesktopSelector, sidenavSlideIn, toggleSidenav} from '../../store'

const withSidenav = WrappedComponent => {

  const WithSidenav = class WithSidenav extends React.Component {

    render() {
      const {
        isDesktop,
        sidenavSlideIn,
        toggleSidenav
      } = this.props

      const classes = classNames(
        'my-sidenav__nav',
        {'my-sidenav__nav--open': sidenavSlideIn},
        {'my-sidenav__nav--animate': !isDesktop}
      )

      return (
        <React.Fragment>
          <header className='my-sidenav__header'>
            {!isDesktop && <IconButton type='bars' onClick={toggleSidenav} inverse />}
          </header>

          <nav className={classes}>
            <NavigationContainer />
          </nav>

          {WrappedComponent && <WrappedComponent />}

          <BackdropContainer />
        </React.Fragment>
      )
    }
  }

  WithSidenav.propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    sidenavSlideIn: PropTypes.bool.isRequired,
    toggleSidenav: PropTypes.func.isRequired
  }

  const mapStateToProps = state => ({
    isDesktop: mediaBreakpointIsDesktopSelector(state),
    sidenavSlideIn: sidenavSlideIn(state)
  })

  const mapDispatchToProps = dispatch => ({
    toggleSidenav: () => dispatch(toggleSidenav())
  })

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithSidenav)
}

export default withSidenav
