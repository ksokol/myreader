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
                onChange={onChange}
                value={searchParams.q}
              />
              <IconButton
                type='redo'
                role='refresh'
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

