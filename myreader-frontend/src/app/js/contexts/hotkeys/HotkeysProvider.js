import React from 'react'
import PropTypes from 'prop-types'
import HotkeysContext from './HotkeysContext'

const KEY_EVENT = 'keyup'

export class HotkeysProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  state = {
    hotkeysStamp: Date.now(),
    hotkey: null
  }

  componentDidMount = () => document.addEventListener(KEY_EVENT, this.onKeyUp)

  componentWillUnmount = () => document.removeEventListener(KEY_EVENT, this.onKeyUp)

  onKeyUp = ({key: hotkey}) => {
    this.setState({
      hotkeysStamp: Date.now(),
      hotkey
    })
  }

  render() {
    return (
      <HotkeysContext.Provider
        value={{
          onKeyUp: this.onKeyUp,
          ...this.state
        }}
      >
        {this.props.children}
      </HotkeysContext.Provider>
    )
  }
}
