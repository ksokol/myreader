import {cloneObject} from '../shared/objects'

export const getEntryInFocus = state => {
    return state.entry.entryInFocus
}

export const getNextFocusableEntry = state => {
    const currentInFocus = getEntryInFocus(state)
    const entries = state.entry.entries

    if (!currentInFocus) {
        return entries[0] ? entries[0].uuid : null
    } else {
        const index = entries.findIndex(it => it.uuid === currentInFocus)
        const next = entries[index + 1]
        return next ? next.uuid : null
    }
}

export const getEntries = state => {
    const {entries, links} = state.entry
    return {
        entries: entries.map(it => cloneObject(it)),
        links: cloneObject(links),
        entryInFocus: getEntryInFocus(state),
        nextFocusableEntry: getNextFocusableEntry(state)
    }
}

export const getEntry = (uuid, state) => {
    return cloneObject(state.entry.entries.find(it => it.uuid === uuid))
}
