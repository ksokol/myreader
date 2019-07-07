import React from 'react'
import PropTypes from 'prop-types'
import {withAppContext} from '../../contexts'

export const withAutofocusEntry = Component => {

  const WithAutofocusEntry = class WithAutofocusEntry extends React.Component {

    static propTypes = {
      entries: PropTypes.arrayOf(
        PropTypes.shape({
          uuid: PropTypes.string.isRequired
        })
      ).isRequired,
      hotkeysStamp: PropTypes.number.isRequired,
      hotkey: PropTypes.string,
      onChangeEntry: PropTypes.func.isRequired,
    }

    state = {
      hotkeysStamp: 0,
      hotkey: null,
      entryInFocus: {}
    }

    static getDerivedStateFromProps(props, state) {
      const entryInFocus = props.entries.find(it => it.uuid === state.entryInFocus.uuid) || {}
      return {
        hotkeysStamp: props.hotkeysStamp,
        hotkey: props.hotkey,
        entryInFocus
      }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.hotkeysStamp !== prevState.hotkeysStamp) {
        switch(this.state.hotkey) {
          case 'ArrowLeft': {
            this.previousEntry()
            break
          }
          case 'ArrowRight': {
            this.nextEntry()
            break
          }
          case 'Escape': {
            this.toggleEntryReadFlag()
            break
          }
        }
      }
    }

    nextEntry = () => {
      const {
        entries
      } = this.props

      const {
        entryInFocus
      } = this.state

      let nextFocusableEntry

      if (!entryInFocus.uuid) {
        nextFocusableEntry = entries[0]
      } else {
        const index = entries.findIndex(it => it.uuid === entryInFocus.uuid)
        nextFocusableEntry = entries[index + 1]
      }

      if (nextFocusableEntry) {
        if (nextFocusableEntry.seen === false) {
          this.props.onChangeEntry({
            ...nextFocusableEntry,
            seen: true
          })
        }

        this.setState({
          entryInFocus: nextFocusableEntry
        })
      }
    }

    previousEntry = () => {
      const {
        entries
      } = this.props

      const {
        entryInFocus
      } = this.state

      if (!entryInFocus.uuid) {
        return
      }

      const index = entries.findIndex(it => it.uuid === entryInFocus.uuid)

      this.setState({
        entryInFocus: entries[index - 1] || {}
      })
    }

    toggleEntryReadFlag = () => {
      if (this.state.entryInFocus.uuid) {
        this.props.onChangeEntry({
          ...this.state.entryInFocus,
          seen: !this.state.entryInFocus.seen
        })
      }
    }

    render() {
      const {
        ...componentProps
      } = this.props

      const {
        entryInFocus
      } = this.state

      return (
        <Component
          {...componentProps}
          entryInFocus={entryInFocus}
        />
      )
    }
  }

  return withAppContext(WithAutofocusEntry)
}
