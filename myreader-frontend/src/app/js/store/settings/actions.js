import * as settingsTypes from '../../store/action-types'
import {
  getPageSize,
  isShowEntryDetails,
  isShowUnseenEntries,
  setPageSize,
  setShowEntryDetails,
  setShowUnseenEntries
} from '../../contexts/settings/settings'

export const loadSettings = () => {
  const settings = {
    pageSize: getPageSize(),
    showUnseenEntries: isShowUnseenEntries(),
    showEntryDetails: isShowEntryDetails()
  }
  return {type: settingsTypes.UPDATE_SETTINGS, settings}
}

export const updateSettings = ({pageSize, showEntryDetails, showUnseenEntries}) => {
  setPageSize(pageSize)
  setShowEntryDetails(showEntryDetails)
  setShowUnseenEntries(showUnseenEntries)

  return loadSettings()
}
