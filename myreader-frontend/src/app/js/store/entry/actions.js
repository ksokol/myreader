import * as types from '../../store/action-types'

export const changeEntry = (newEntry, oldEntry) => ({
  type: types.ENTRY_CHANGED,
  newValue: {...newEntry},
  oldValue: oldEntry
})
