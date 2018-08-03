import {createSelector} from 'reselect'
import {cloneObject} from '../../store/shared/objects'

const adminSelector = state => state.admin

export const applicationInfoSelector = state => state.admin.applicationInfo

export const feedsSelector =
  createSelector(
    adminSelector,
    admin => {
      return {
        feeds: cloneObject(admin.feeds)
      }
    }
  )

export const feedSelector =
  createSelector(
    adminSelector,
    admin => cloneObject(admin.selectedFeed)
  )

export const feedFetchFailuresSelector =
  createSelector(
    adminSelector,
    admin => {
      return {
        ...cloneObject(admin.fetchFailures),
        fetchFailuresLoading: admin.fetchFailuresLoading
      }
    }
  )
