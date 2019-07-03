import * as types from '../../store/action-types'
import {toEntries, toEntry} from './entry'
import {getEntry} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'
import {toUrlString} from '../../api/links'

export const entryPageReceived = raw => {
  return {type: types.ENTRY_PAGE_RECEIVED, ...toEntries(raw)}
}

export const entryChanged = entry => {
  return (dispatch, getState) => {
    if (entry && entry.uuid) {
      dispatch({type: types.ENTRY_CHANGED, newValue: toEntry(entry), oldValue: getEntry(entry.uuid, getState())})
    }
  }
}

export const entryClear = () => {
  return {type: types.ENTRY_CLEAR}
}

export const fetchEntries = ({pageSize: size, ...rest}) => {
  return {
    type: 'GET_ENTRIES',
    url: toUrlString({...rest, size}),
    before: () => ({type: types.ENTRY_PAGE_LOADING}),
    success: response => entryPageReceived(response),
    finalize: () => ({type: types.ENTRY_PAGE_LOADED})
  }
}

export const changeEntry = ({uuid, seen, tag}) => {
  return {
    type: 'PATCH_ENTRY',
    url: `${SUBSCRIPTION_ENTRIES}/${uuid}`,
    body: {seen, tag},
    success: response => entryChanged(response)
  }
}
