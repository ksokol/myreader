import './Backdrop.css'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDom from 'react-dom'

export class Backdrop extends React.Component {

  static propTypes = {
    maybeVisible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  state = {
    isVisible: false,
    isClosing: false,
    isMounted: false
  }

  componentDidUpdate() {
    if (this.state.isVisible === this.props.maybeVisible) {
      return
    }
    clearTimeout(this.timeout)

    if (this.state.isVisible) {
      this.scheduleUnmount()
      this.setState({
        isVisible: this.props.maybeVisible,
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
