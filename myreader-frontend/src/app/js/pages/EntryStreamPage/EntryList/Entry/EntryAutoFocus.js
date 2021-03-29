import {useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'
import {Entry} from './Entry'

export function EntryAutoFocus({
  item,
  focusUuid,
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

  if (state.focused) {
    entryProps.role = 'entry-in-focus'
  }

  return (
    <Entry
      entryRef={el => entryRef = el}
      item={item}
      {...entryProps}
    />
  )
}

EntryAutoFocus.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string.required,
  }),
  focusUuid: PropTypes.string
}
