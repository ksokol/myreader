import {cloneObject} from '../shared/objects'

export const getEntries = state => {
  const {entries, links, loading} = state.entry
  return {
    entries: entries.map(it => cloneObject(it)),
    links: cloneObject(links),
    loading
  }
}

export const getEntry = (uuid, state) => {
  return cloneObject(state.entry.entries.find(it => it.uuid === uuid))
}

