import './FeedList.css'
import React from 'react'
import PropTypes from 'prop-types'
import {generatePath} from 'react-router'
import {Link} from 'react-router-dom'
import {Icon} from '../Icon/Icon'
import TimeAgo from '../TimeAgo/TimeAgo'
import {ADMIN_FEED_URL} from '../../constants'
import {useSearchParams} from '../../hooks/useSearchParams'

function filterFeeds(feeds, q = '') {
  return q
    ? feeds.filter(({title}) => title.toLowerCase().includes(q.toLowerCase()))
    : feeds
}

export function FeedList({feeds}) {
  const {q} = useSearchParams()
  const filteredFeeds = filterFeeds(feeds, q)

  return (
    <div
      className='my-feed-list'
    >
      {filteredFeeds.map(feed => (
        <div
          key={feed.uuid}
          className='my-feed-list__item flex flex-col'
        >
          <Link
            className='my-feed-list__item-heading no-underline'
            to={generatePath(ADMIN_FEED_URL, {uuid: feed.uuid})}
          >
            {feed.title}
          </Link>
          <span>
            {feed.hasErrors && <Icon type='exclamation-triangle' />}
            <TimeAgo date={feed.createdAt}/>
          </span>
        </div>))
      }
    </div>
  )
}

FeedList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      hasErrors: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired
}
