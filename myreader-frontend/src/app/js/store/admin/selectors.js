import {createSelector} from 'reselect'
import {cloneObject} from '../shared/objects'

const adminSelector = state => state.admin

export const applicationInfoSelector = state => state.admin.applicationInfo

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

