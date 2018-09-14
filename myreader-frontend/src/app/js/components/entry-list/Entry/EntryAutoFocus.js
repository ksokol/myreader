import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Entry from './Entry'

class EntryAutoFocus extends Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps(props, state) {
    return {
      shouldScroll: props.item.uuid === props.focusUuid && state.lastFocusUuid !== props.focusUuid,
      focused: props.item.uuid === props.focusUuid,
      lastFocusUuid: props.focusUuid
    }
  }

  componentDidUpdate() {
    if (this.state.shouldScroll) {
      this.entryRef.scrollIntoView({block: 'start', behavior: 'smooth'})
    }
  }

  render() {
    const {
      focusUuid,
      ...props
    } = this.props

    props.className = this.state.focused ? 'my-entry--focus' : undefined

    return <Entry entryRef={el => this.entryRef = el} {...props} />
  }
}

EntryAutoFocus.propTypes = {
  focusUuid: PropTypes.string
}

export default EntryAutoFocus
