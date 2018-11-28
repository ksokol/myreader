import './SubscriptionList.css'
import React from 'react'
import PropTypes from 'prop-types'
import {TimeAgo} from '../../components'

const SubscriptionList = props => {
  return (
    <div className='my-subscription-list'>
      {props.subscriptions.map(subscription => (
        <div key={subscription.uuid}
             className='my-subscription-list__item'
             onClick={() => props.navigateTo(subscription)}>
          <h3>{subscription.title}</h3>
          <span>
            <TimeAgo date={subscription.createdAt}/>
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
  ).isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default SubscriptionList
