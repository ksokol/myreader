import {cloneObject} from '../shared/objects'

export const getEntryInFocus = state => {
  const entry = state.entry.entries.find(it => it.uuid === state.entry.entryInFocus)
  return entry ? {...entry} : {}
}

export const getNextFocusableEntry = state => {
  const currentInFocus = getEntryInFocus(state)
  const entries = state.entry.entries

  if (!currentInFocus.uuid) {
    return entries[0] ? {...entries[0]} : {}
  } else {
    const index = entries.findIndex(it => it.uuid === currentInFocus.uuid)
    const next = entries[index + 1]
    return next ? {...next} : {}
  }
}

export const getEntries = state => {
  const {entries, links, loading} = state.entry
  return {
    entries: entries.map(it => cloneObject(it)),
    links: cloneObject(links),
    entryInFocus: getEntryInFocus(state),
    loading
  }
}

export const getEntry = (uuid, state) => {
  return cloneObject(state.entry.entries.find(it => it.uuid === uuid))
}

