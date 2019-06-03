import {FEEDS} from '../../constants'

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

export const deleteFeed = ({uuid, success, error}) => {
  return {
    type: 'DELETE_FEED',
    url: `${FEEDS}/${uuid}`,
    success,
    error
  }
}
