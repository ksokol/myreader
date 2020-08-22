import React, {useEffect, useReducer} from 'react'
import PropTypes from 'prop-types'
import {useHotkeys} from '../../contexts/hotkeys'

function reducer(state, action) {
  switch(action.type) {
  case 'ArrowRight': {
    let nextFocusableEntry

    if (!state.entryInFocus.uuid) {
      nextFocusableEntry = state.entries[0]
    } else {
      const index = state.entries.findIndex(it => it.uuid === state.entryInFocus.uuid)
      nextFocusableEntry = state.entries[index + 1]
    }

    const newState = {
      ...state,
      hotkey: action.hotkey,
    }

    return nextFocusableEntry ? {
      ...newState,
      entryInFocus: nextFocusableEntry,
    } : newState
  }
  case 'ArrowLeft': {
    const entryInFocus = state.entryInFocus

    if (!entryInFocus.uuid) {
      return state
    }

    const index = state.entries.findIndex(it => it.uuid === entryInFocus.uuid)

    return {
      ...state,
      hotkey: action.hotkey,
      entryInFocus: state.entries[index - 1] || {},
    }
  }

  case 'Escape': {
    return {
      ...state,
      hotkey: action.hotkey,
    }
  }
  case 'entries': {
    let entryInFocus = state.entryInFocus
    const entries = action.entries

    if (entries.length === 0) {
      entryInFocus = {}
    } else if (state.entryInFocus.uuid) {
      const index = entries.findIndex(it => it.uuid === entryInFocus.uuid)
      if (index !== -1) {
        entryInFocus.seen = entries[index].seen
      }
    }

    return {
      ...state,
      entryInFocus,
      entries,
    }
  } default: {
    return state
  }
  }
}

/**
 * Move escape key handler into child component.
 * Replace hoc with hooks.
 *
 * @deprecated
 */
export const withAutofocusEntry = Component => {

  const WithAutofocusEntry = function WithAutofocusEntry({
    entries,
    onChangeEntry,
    ...componentProps
  }) {

    const {hotkeysStamp, hotkey} = useHotkeys()

    const [state, dispatch] = useReducer(reducer, {
      hotkey,
      hotkeysStamp,
      entries: entries || [],
      entryInFocus: {},
    })

    useEffect(() => {
      dispatch({type: 'entries', entries})
    }, [entries])

    useEffect(() => {
      dispatch({type: hotkey, hotkey})
    }, [dispatch, hotkey, hotkeysStamp])

    useEffect(() => {
      if (
        state.hotkey === 'ArrowRight' &&
        state.hotkey === hotkey &&
        state.entryInFocus.uuid &&
        state.entryInFocus.seen === false
      ) {
        onChangeEntry({
          ...state.entryInFocus,
          seen: !state.entryInFocus.seen
        })
      }
    }, [onChangeEntry, state.entryInFocus, state.hotkey, hotkey, hotkeysStamp])


    useEffect(() => {
      if (
        state.hotkey === 'Escape' &&
        state.hotkey === hotkey &&
        state.entryInFocus.uuid
      ) {
        onChangeEntry({
          ...state.entryInFocus,
          seen: !state.entryInFocus.seen
        })
      }
    }, [onChangeEntry, state.entryInFocus, state.hotkey, hotkey, hotkeysStamp])

    return (
      <Component
        {...componentProps}
        entries={entries}
        onChangeEntry={onChangeEntry}
        entryInFocus={state.entryInFocus}
      />
    )
  }

  WithAutofocusEntry.propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired
      })
    ).isRequired,
    onChangeEntry: PropTypes.func.isRequired,
  }

  return WithAutofocusEntry
}
