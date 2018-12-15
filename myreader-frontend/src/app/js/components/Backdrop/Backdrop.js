import './Backdrop.css'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDom from 'react-dom'
import classNames from 'classnames'

class Backdrop extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      isVisible: false,
      isClosing: false,
      isMounted: false
    }

    this.scheduleUnmount = this.scheduleUnmount.bind(this)
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

  scheduleUnmount() {
    this.timeout = setTimeout(() => {
      this.setState({
        isVisible: false,
        isClosing: false,
        isMounted: false
      })
    }, 300)
  }

  render() {
    const classes = classNames('my-backdrop', {
      'my-backdrop--visible': this.state.isVisible,
      'my-backdrop--closing': this.state.isClosing
    })

    return this.state.isMounted ?
      ReactDom.createPortal(
        <div className={classes}
             onClick={this.props.onClick}>
        </div>,
        document.body
      ) : null
  }
}

Backdrop.propTypes = {
  isBackdropVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Backdrop
