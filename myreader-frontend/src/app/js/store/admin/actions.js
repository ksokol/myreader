import * as types from '../../store/action-types'
import {FEEDS} from '../../constants'
import {toFeeds} from './feed'

export const feedsReceived = raw => {
  return {
    type: types.FEEDS_RECEIVED,
    ...toFeeds(raw)
  }
}

export const fetchFeeds = () => {
  return {
    type: 'GET_FEEDS',
    url: FEEDS,
    success: response => feedsReceived(response)
  }
}

export const fetchFeed = ({uuid, success}) => {
  return {
    type: 'GET_FEED',
    url: `${FEEDS}/${uuid}`,
    success
  }
}

export const saveFeed = ({feed, success, error, finalize}) => {
  return {
    type: 'PATCH_FEED',
    url: `${FEEDS}/${feed.uuid}`,
    body: feed,
    success,
    error,
    finalize
  }
}

export const feedDeleted = uuid => {
  return {
    type: types.FEED_DELETED,
    uuid
  }
}

export const deleteFeed = ({uuid, success, error}) => {
  return {
    type: 'DELETE_FEED',
    url: `${FEEDS}/${uuid}`,
    success,
    error
  }
}
