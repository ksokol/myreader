import {cloneObject} from '../shared/objects'

export const getEntryInFocus = getState => {
    return getState().entry.entryInFocus
}

export const getNextFocusableEntry = getState => {
    const currentInFocus = getEntryInFocus(getState)
    const entries = getState().entry.entries

    if (!currentInFocus) {
        return entries[0] ? entries[0].uuid : null
    } else {
        const index = entries.findIndex(it => it.uuid === currentInFocus)
        const next = entries[index + 1]
        return next ? next.uuid : null
    }
}

export const getEntries = getState => {
    const {entries, links} = getState().entry
    return {
        entries: entries.map(it => cloneObject(it)),
        links: cloneObject(links),
        entryInFocus: getEntryInFocus(getState),
        nextFocusableEntry: getNextFocusableEntry(getState)
    }
}

export const getEntry = (uuid, getState) => {
    return cloneObject(getState().entry.entries.find(it => it.uuid === uuid))
}
