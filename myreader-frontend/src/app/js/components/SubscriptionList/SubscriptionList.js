import './SubscriptionList.css'
import React from 'react'
import PropTypes from 'prop-types'
import {generatePath} from 'react-router'
import {Link} from 'react-router-dom'
import {TimeAgo} from '..'
import {SUBSCRIPTION_URL} from '../../constants'

const SubscriptionList = props => {
  return (
    <div
      className='my-subscription-list'
    >
      {props.subscriptions.map(subscription => (
        <div
          key={subscription.uuid}
          className='my-subscription-list__item flex flex-col'
        >
          <Link
            className='my-subscription-list__item-heading no-underline'
            to={generatePath(SUBSCRIPTION_URL, {uuid: subscription.uuid})}
          >
            {subscription.title}
          </Link>
          <span>
            <TimeAgo
              date={subscription.createdAt}
            />
          </span>
        </div>))
      }
    </div>
  )
}

SubscriptionList.propTypes = {
  subscriptions: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired
}

export default SubscriptionList
