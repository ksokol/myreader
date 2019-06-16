import './SidenavLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {IconButton} from '../Buttons'
import {
  backdropIsVisible,
  fetchSubscriptions,
  hideBackdrop,
  mediaBreakpointIsDesktopSelector,
  sidenavSlideIn,
  toggleSidenav
} from '../../store'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import Navigation from '../Navigation/Navigation'
import {Backdrop} from '../Backdrop/Backdrop'

const mapStateToProps = state => ({
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  sidenavSlideIn: sidenavSlideIn(state),
  isBackdropVisible: backdropIsVisible(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleSidenav,
  fetchSubscriptions,
  hideBackdrop
}, dispatch)

class SidenavLayout extends React.Component {

  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    sidenavSlideIn: PropTypes.bool.isRequired,
    isBackdropVisible: PropTypes.bool.isRequired,
    toggleSidenav: PropTypes.func.isRequired,
    locationReload: PropTypes.bool.isRequired,
    fetchSubscriptions: PropTypes.func.isRequired,
    hideBackdrop: PropTypes.func.isRequired,
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
      isBackdropVisible,
      toggleSidenav,
      hideBackdrop,
      children
    } = this.props

    const classes = [
      'my-sidenav-layout__nav',
      sidenavSlideIn ? 'my-sidenav-layout__nav--open': '',
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
              onClick={toggleSidenav}
              inverse
            />
          )}
        </header>

        <nav
          className={classes.join(' ')}
        >
          <Navigation
            onClick={toggleSidenav}
          />
        </nav>

        <main
          className='my-sidenav-layout__main'
        >{children}
        </main>

        <Backdrop
          maybeVisible={isBackdropVisible}
          onClick={hideBackdrop}
        />
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
