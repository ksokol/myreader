import './FeedList.css'
import React from 'react'
import {Icon, TimeAgo} from '..'
import PropTypes from 'prop-types'

const FeedList = props => {
  return (
    <div className='my-feed-list'>
      {props.feeds.map(feed => (
        <div key={feed.uuid}
             className='my-feed-list__item'
             onClick={() => props.navigateTo(feed)}>
          <h3>{feed.title}</h3>
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
  ).isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default FeedList
