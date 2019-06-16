import './Backdrop.css'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDom from 'react-dom'
import {connect} from 'react-redux'
import {backdropIsVisible, hideBackdrop} from '../../store'

const mapStateToProps = state => ({
  isBackdropVisible: backdropIsVisible(state)
})

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch(hideBackdrop())
})

class Component extends React.Component {

  static propTypes = {
    isBackdropVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  state = {
    isVisible: false,
    isClosing: false,
    isMounted: false
  }

  componentDidUpdate() {
    if (this.state.isVisible === this.props.isBackdropVisible) {
      return
    }
    clearTimeout(this.timeout)

    if (this.state.isVisible) {
      this.scheduleUnmount()
      this.setState({
        isVisible: this.props.isBackdropVisible,
        isClosing: true,
        isMounted: true
      })
    } else {
      this.setState({
        isVisible: true,
        isClosing: false,
        isMounted: true
      })
    }
  }

  componentWillUnmount = () => clearTimeout(this.timeout)

  scheduleUnmount = () => {
    this.timeout = setTimeout(() => {
      this.setState({
        isVisible: false,
        isClosing: false,
        isMounted: false
      })
    }, 300)
  }

  render() {
    const classes = [
      'my-backdrop',
      this.state.isVisible ? 'my-backdrop--visible': '',
      this.state.isClosing ? 'my-backdrop--closing': ''
    ]

    return this.state.isMounted ? (
      ReactDom.createPortal(
        <div
          className={classes.join(' ')}
          onClick={this.props.onClick}
        />,
        document.body
      )
    ) : null
  }
}

export const Backdrop = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
