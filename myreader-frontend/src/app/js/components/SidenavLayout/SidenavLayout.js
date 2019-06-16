import './SidenavLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {IconButton} from '../Buttons'
import {fetchSubscriptions} from '../../store'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import Navigation from '../Navigation/Navigation'
import {Backdrop} from '../Backdrop/Backdrop'
import MediaBreakpointContext from '../../contexts/mediaBreakpoint/MediaBreakpointContext'

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSubscriptions
}, dispatch)

class SidenavLayout extends React.Component {

  static propTypes = {
    mediaBreakpoint: PropTypes.string.isRequired,
    locationReload: PropTypes.bool.isRequired,
    fetchSubscriptions: PropTypes.func.isRequired,
    children: PropTypes.any
  }

  state = {
    isDesktop: false,
    sidenavSlideIn: false,
    backdropVisible: false
  }

  static getDerivedStateFromProps(props) {
    return {
      isDesktop: props.mediaBreakpoint === 'desktop'
    }
  }

  componentDidMount = () => this.fetchSubscriptions()

  componentDidUpdate(prevProps, prevState) {
    if (this.props.locationReload) {
      this.fetchSubscriptions()
    }

    if (this.state.isDesktop !== prevState.isDesktop && this.state.isDesktop) {
      this.setState({
        backdropVisible: false,
        sidenavSlideIn: false
      })
    }
  }

  fetchSubscriptions = () => this.props.fetchSubscriptions()

  toggleSidenav = () => {
    if (!this.state.isDesktop) {
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
        >{this.props.children}
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
    () => ({}),
    mapDispatchToProps
  )(props => (
    <MediaBreakpointContext.Consumer>
      {value => <SidenavLayout {...props} {...value} />}
    </MediaBreakpointContext.Consumer>
  ))
)
