import './SidenavLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {IconButton} from '../Buttons'
import {fetchSubscriptions, mediaBreakpointIsDesktopSelector} from '../../store'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import Navigation from '../Navigation/Navigation'
import {Backdrop} from '../Backdrop/Backdrop'

const mapStateToProps = state => ({
  isDesktop: mediaBreakpointIsDesktopSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSubscriptions
}, dispatch)

class SidenavLayout extends React.Component {

  static propTypes = {
    isDesktop: PropTypes.bool.isRequired,
    locationReload: PropTypes.bool.isRequired,
    fetchSubscriptions: PropTypes.func.isRequired,
    children: PropTypes.any
  }

  state = {
    sidenavSlideIn: false,
    backdropVisible: false
  }

  componentDidMount = () => this.fetchSubscriptions()

  componentDidUpdate(prevProps) {
    if (this.props.locationReload) {
      this.fetchSubscriptions()
    }

    if (this.props.isDesktop !== prevProps.isDesktop && this.props.isDesktop) {
      this.setState({
        backdropVisible: false,
        sidenavSlideIn: false
      })
    }
  }

  fetchSubscriptions = () => this.props.fetchSubscriptions()

  toggleSidenav = () => {
    if (!this.props.isDesktop) {
      this.setState(state => ({
        backdropVisible: !state.backdropVisible,
        sidenavSlideIn: !state.sidenavSlideIn
      }))
    }
  }

  hideBackdrop = () => {
    this.setState(state => {
      let backdropVisible = !state.backdropVisible
      return {
        backdropVisible,
        sidenavSlideIn: backdropVisible
      }
    })
  }

  render() {
    const {
      isDesktop,
      children
    } = this.props

    const {
      sidenavSlideIn,
      backdropVisible
    } = this.state

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
              onClick={this.toggleSidenav}
              inverse
            />
          )}
        </header>

        <nav
          className={classes.join(' ')}
        >
          <Navigation
            onClick={this.toggleSidenav}
          />
        </nav>

        <main
          className='my-sidenav-layout__main'
        >{children}
        </main>

        <Backdrop
          maybeVisible={backdropVisible}
          onClick={this.hideBackdrop}
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
