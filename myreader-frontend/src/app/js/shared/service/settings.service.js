import {
    getPageSize, isShowEntryDetails, isShowUnseenEntries, setPageSize,
    setShowEntryDetails, setShowUnseenEntries
} from "../../store/common/settings";

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
