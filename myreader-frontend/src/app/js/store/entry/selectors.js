import {cloneObject} from '../shared/objects'

export const getEntries = getState => {
    const {entries, links} = getState().entry
    return {
        entries: entries.map(it => cloneObject(it)),
        links: cloneObject(links)
    }
}
