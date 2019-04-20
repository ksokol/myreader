import {cloneObject} from '../../store/shared/objects'

export const applicationInfoSelector = state => state.admin.applicationInfo

export const filteredBySearchFeedsSelector = (q = '') =>
  state => ({
    feeds: q
      ? state.admin.feeds
        .filter(({title}) => title.toLowerCase().indexOf(q.toLowerCase()) !== -1)
        .map(cloneObject)
      : state.admin.feeds.map(cloneObject)
  })

export const feedFetchFailuresSelector = state => ({
  ...cloneObject(state.admin.fetchFailures),
  fetchFailuresLoading: state.admin.fetchFailuresLoading
})
