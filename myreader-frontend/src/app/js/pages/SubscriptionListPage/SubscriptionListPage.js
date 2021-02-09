import './SubscriptionListPage.css'
import React from 'react'
import {generatePath} from 'react-router'
import SubscriptionContext from '../../contexts/subscription/SubscriptionContext'
import {ListLayout} from '../../components/ListLayout/ListLayout'
import {SearchInput} from '../../components/SearchInput/SearchInput'
import {IconButton} from '../../components/Buttons'
import {useHistory, useSearchParams} from '../../hooks/router'
import {Link} from 'react-router-dom'
import {SUBSCRIPTION_URL} from '../../constants'
import {TimeAgo} from '../../components/TimeAgo/TimeAgo'
import {Icon} from '../../components/Icon/Icon'

function filterSubscriptions({title}, q = '') {
  return title.toLowerCase().includes(q.toLowerCase())
}

export const SubscriptionListPage = () => {
  const searchParams = useSearchParams()
  const {push, reload} = useHistory()

  const onChange = q => {
    push({
      searchParams: {
        q
      }
    })
  }

  return (
    <SubscriptionContext.Consumer>
      {({subscriptions}) => (
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
                onClick={reload}
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
                      title={subscription.title}
                      to={generatePath(SUBSCRIPTION_URL, {uuid: subscription.uuid})}
                    >
                      {subscription.title}
                    </Link>
                    <span>
                      {subscription.fetchErrorCount > 0 && <Icon type='exclamation-triangle' />}
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
      )}
    </SubscriptionContext.Consumer>
  )
}

