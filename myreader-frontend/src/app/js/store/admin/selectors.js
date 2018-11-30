import {createSelector} from 'reselect'
import {cloneObject} from '../../store/shared/objects'

const routerQuerySelector = state => state.router.query
const adminSelector = state => state.admin

export const applicationInfoSelector = state => state.admin.applicationInfo

export const filteredBySearchFeedsSelector = createSelector(
  adminSelector,
  routerQuerySelector,
  (admin, {q}) => {
    return {
      feeds: q
        ? admin.feeds
          .filter(({title}) => title.toLowerCase().indexOf(q.toLowerCase()) !== -1)
          .map(cloneObject)
        : admin.feeds.map(cloneObject)
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
