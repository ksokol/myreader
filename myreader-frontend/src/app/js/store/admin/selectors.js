import {createSelector} from 'reselect'
import {cloneObject} from 'store/shared/objects'

const adminSelector = state => state.admin

export const applicationInfoSelector = state => state.admin.applicationInfo

export const feedSelector =
    createSelector(
        adminSelector,
        admin => cloneObject(admin.selectedFeed)
    )

export const feedFetchFailuresSelector =
    createSelector(
        adminSelector,
        applicationInfoSelector,
        (admin, applicationInfo) => {
            return {
                ...cloneObject(admin.fetchFailures),
                fetchErrorRetainDays: applicationInfo.fetchErrorRetainDays
            }
        }
    )
