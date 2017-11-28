import {
    getPageSize, isShowEntryDetails, isShowUnseenEntries, setPageSize,
    setShowEntryDetails, setShowUnseenEntries
} from "../../store/settings/settings";

/*
 * @deprecated
 */
export function SettingsService() {
    return {
        getPageSize,
        isShowUnseenEntries,
        isShowEntryDetails,
        setPageSize,
        setShowEntryDetails,
        setShowUnseenEntries
    }
}
