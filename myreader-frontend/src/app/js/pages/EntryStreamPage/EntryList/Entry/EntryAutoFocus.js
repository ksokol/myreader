import {useEffect, useState, useRef} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import PropTypes from 'prop-types'
import {Entry} from './Entry'

export function EntryAutoFocus({
  item,
  focusUuid,
  onChangeEntry,
  ...entryProps
}) {
  const [state, setState] = useState({
    shouldScroll: false,
    focused: false,
    lastFocusUuid: undefined
  })
  let entryRef = useRef()

  useEffect(() => {
    setState({
      shouldScroll: item.uuid === focusUuid && state.lastFocusUuid !== focusUuid,
      focused: item.uuid === focusUuid,
      lastFocusUuid: focusUuid
    }
    )
  }, [focusUuid, item.uuid, state.lastFocusUuid])

  useEffect(() => {
    if (state.shouldScroll) {
      entryRef.scrollIntoView({block: 'start', behavior: 'smooth'})
    }
  }, [state.shouldScroll])

  useHotkeys('escape' ,() => {
    if (state.focused) {
      onChangeEntry({
        ...item,
        seen: !item.seen,
      })
    }
  }, [state.focused, item])

  if (state.focused) {
    entryProps.role = 'entry-in-focus'
  }

  return (
    <Entry
      entryRef={el => entryRef = el}
      item={item}
      onChangeEntry={onChangeEntry}
      {...entryProps}
    />
  )
}

EntryAutoFocus.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string.required,
    seen: PropTypes.bool.required,
  }),
  focusUuid: PropTypes.string,
  onChangeEntry: PropTypes.func.isRequired,
}
