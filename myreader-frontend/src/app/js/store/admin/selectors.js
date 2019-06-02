import {cloneObject} from '../../store/shared/objects'

export const feedsSelector = state => ({
  feeds: state.admin.feeds.map(cloneObject)
})
