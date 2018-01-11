export const getSettings = state => {
    return {
        ...state.settings
    }
}

export const settingsShowUnseenEntriesSelector = state => state.settings.showUnseenEntries

export const settingsShowEntryDetailsSelector = state => state.settings.showEntryDetails
