import './FeedList.css'
import React from 'react'
import {Icon, TimeAgo} from '..'
import PropTypes from 'prop-types'
import {adminFeedDetailRoute} from '../../routes'
import {Link} from 'react-router-dom'

const FeedList = props => {
  return (
    <div
      className='my-feed-list'
    >
      {props.feeds.map(feed => (
        <div
          key={feed.uuid}
          className='my-feed-list__item flex flex-col'
        >
          <Link
            className='my-feed-list__item-heading no-underline'
            to={adminFeedDetailRoute(feed)}
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

export default FeedList
