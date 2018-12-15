import React from 'react'
import PropTypes from 'prop-types'

const keyCodeMap = {
  13: 'enter',
  27: 'esc',
  38: 'up',
  40: 'down'
}

const KEY_EVENT = 'keyup'

class Hotkeys extends React.Component {

  constructor(props) {
    super(props)

    this.onKeyPress = this.onKeyPress.bind(this)
  }

  componentDidMount() {
    document.addEventListener(KEY_EVENT, this.onKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener(KEY_EVENT, this.onKeyPress)
  }

  onKeyPress(event) {
    Object.entries(this.props.onKeys)
      .filter(([key]) => keyCodeMap[event.keyCode] === key || event.key === key)
      .map(([, keyFn]) => keyFn)
      .forEach(keyFn => keyFn())
  }

  render() {
    return this.props.children
  }
}

Hotkeys.propTypes = {
  onKeys: PropTypes.objectOf(PropTypes.func.isRequired),
  children: PropTypes.node
}

Hotkeys.defaultProps = {
  onKeys: {}
}

export default Hotkeys
