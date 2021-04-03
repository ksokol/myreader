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
    focused: false,
    lastFocusUuid: undefined,
  })
  const [flag, setFlag] = useState([])
  const itemRef = useRef(item)
  let entryRef = useRef()

  useEffect(() => {
    itemRef.current = item
  }, [item])

  useEffect(() => {
    setState({
      focused: item.uuid === focusUuid,
      lastFocusUuid: focusUuid,
    })
  }, [item, focusUuid, item.uuid, state.lastFocusUuid])

  useEffect(() => {
    if (item.uuid === focusUuid && state.lastFocusUuid !== focusUuid) {
      entryRef.scrollIntoView({block: 'start', behavior: 'smooth'})
    }
  }, [focusUuid, item.uuid, state.lastFocusUuid])

  useEffect(() => {
    if (flag[0]) {
      onChangeEntry(flag[0])
      setFlag(current => current.splice(1))
    }
  }, [flag, onChangeEntry])

  useEffect(() => {
    if (state.focused && itemRef.current.seen === false) {
      setFlag(current => [
        ...current, {
          ...itemRef.current,
          seen: true,
        }]
      )
    }
  }, [state.focused])

  useHotkeys('escape' ,() => {
    if (state.focused) {
      setFlag(current => [
        ...current, {
          ...itemRef.current,
          seen: !itemRef.current.seen,
        }]
      )
    }
  }, [state.focused])

  if (state.focused) {
    entryProps.role = 'entry-in-focus'
  }

  return (
    <Entry
      entryRef={el => entryRef = el}
      item={item}
      onChangeEntry={entry => {
        setFlag(current => [
          ...current, {
            ...entry
          }]
        )
      }}
      {...entryProps}
    />
  )
}

EntryAutoFocus.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string.required,
    seen: PropTypes.bool.required,
    tags: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
  }),
  focusUuid: PropTypes.string,
  onChangeEntry: PropTypes.func.isRequired,
}
