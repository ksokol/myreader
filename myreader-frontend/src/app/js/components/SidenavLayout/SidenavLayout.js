import './SidenavLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import classNames from 'classnames'
import {IconButton} from '..'
import {BackdropContainer} from '../../containers'
import {fetchSubscriptions, mediaBreakpointIsDesktopSelector, sidenavSlideIn, toggleSidenav} from '../../store'
import {withLocationState} from '../../contexts'
import Navigation from '../Navigation/Navigation'

const mapStateToProps = state => ({
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  sidenavSlideIn: sidenavSlideIn(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleSidenav,
  fetchSubscriptions
}, dispatch)

class SidenavLayout extends React.Component {

  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    sidenavSlideIn: PropTypes.bool.isRequired,
    toggleSidenav: PropTypes.func.isRequired,
    locationReload: PropTypes.bool.isRequired,
    fetchSubscriptions: PropTypes.func.isRequired,
    children: PropTypes.any
  }

  componentDidMount() {
    this.fetchSubscriptions()
  }

  componentDidUpdate() {
    if (this.props.locationReload) {
      this.fetchSubscriptions()
    }
  }

  fetchSubscriptions = () => {
    this.props.fetchSubscriptions()
  }

  render() {
    const {
      isDesktop,
      sidenavSlideIn,
      toggleSidenav,
      children
    } = this.props

    const classes = classNames(
      'my-sidenav-layout__nav',
      {'my-sidenav-layout__nav--open': sidenavSlideIn},
      {'my-sidenav-layout__nav--animate': !isDesktop}
    )

    return (
      <div
        className='my-sidenav-layout'
      >
        <header
          className='my-sidenav-layout__header'
        >
          {!isDesktop && <IconButton type='bars' onClick={toggleSidenav} inverse/>}
        </header>

        <nav
          className={classes}
        >
          <Navigation />
        </nav>

        <main
          className='my-sidenav-layout__main'
        >
          {children}
        </main>

        <BackdropContainer />
      </div>
    )
  }
}

export default withLocationState(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SidenavLayout)
)
