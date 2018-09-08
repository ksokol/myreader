import React, {Component} from 'react'
import PropTypes from 'prop-types'

const keyCodeMap = {
  13: 'enter',
  27: 'esc',
  38: 'up',
  40: 'down'
}

class Hotkeys extends Component {

  constructor(props) {
    super(props)

    this.myRef = React.createRef()
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  componentDidMount() {
    this.myRef.current.addEventListener('keypress', this.onKeyPress)
  }

  onKeyPress(event) {
    Object.entries(this.props.onKeys)
      .filter(([key]) => keyCodeMap[event.keyCode] === key || event.key === key)
      .map(([, keyFn]) => keyFn)
      .forEach(keyFn => keyFn())
  }

  render() {
    return <div ref={this.myRef}>{this.props.children}</div>
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
