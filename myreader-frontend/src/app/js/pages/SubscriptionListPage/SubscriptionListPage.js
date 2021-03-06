import './SubscriptionListPage.css'
import React from 'react'
import {generatePath, useHistory, useLocation} from 'react-router'
import {Link} from 'react-router-dom'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {IconButton} from '../../components/Buttons'
import {useSearchParams} from '../../hooks/router'
import {SUBSCRIPTION_PAGE_PATH} from '../../constants'
import {TimeAgo} from '../../components/TimeAgo/TimeAgo'
import {Icon} from '../../components/Icon/Icon'
import {useSubscriptions} from '../../hooks/subscriptions'

function filterSubscriptions({title}, q = '') {
  return title.toLowerCase().includes(q.toLowerCase())
}

export const SubscriptionListPage = () => {
  const location = useLocation()
  const searchParams = useSearchParams()
  const history = useHistory()

  const {
    subscriptions,
    fetchSubscriptions
  } = useSubscriptions()

  const onChange = q => {
    history.push({
      ...location,
      search: q ? new URLSearchParams(`q=${q}`).toString() : ''
    })
  }

  return (
    <ListLayout
      actionPanel={
        <>
          <SearchInput
            className='my-subscription-list-search-input'
            onChange={onChange}
            inverse={true}
            value={searchParams.q}
          />
          <IconButton
            type='redo'
            role='refresh'
            inverse={true}
            onClick={fetchSubscriptions}
          />
        </>
      }
      listPanel={
        <div
          className='my-subscription-list-page'
        >
          {subscriptions
            .filter(subscription => filterSubscriptions(subscription, searchParams.q))
            .map(subscription => (
              <div
                key={subscription.uuid}
                className='my-subscription-list-page__item flex flex-col'
              >
                <Link
                  className='my-subscription-list-page__item-heading no-underline'
                  to={generatePath(SUBSCRIPTION_PAGE_PATH, {uuid: subscription.uuid})}
                >
                  {subscription.title}
                </Link>
                <span>
                  {subscription.fetchErrorCount > 0 && <Icon type='exclamation-triangle'/>}
                  <TimeAgo
                    date={subscription.createdAt}
                  />
                </span>
              </div>
            ))
          }
        </div>
      }
    />
  )
}

