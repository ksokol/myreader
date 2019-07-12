import './SidenavLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {IconButton} from '../Buttons'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import Navigation from '../Navigation/Navigation'
import {Backdrop} from '../Backdrop/Backdrop'
import {withAppContext} from '../../contexts'

class Component extends React.Component {

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

  componentDidMount = () => this.props.fetchSubscriptions()

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDesktop !== prevState.isDesktop && this.state.isDesktop) {
      this.setState({
        backdropVisible: false,
        sidenavSlideIn: false
      })
    }
  }

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

export const SidenavLayout = withLocationState(withAppContext(Component))
