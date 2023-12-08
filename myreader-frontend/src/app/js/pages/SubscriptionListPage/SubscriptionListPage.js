import {ListLayout} from '../../components/ListLayout'
import {SearchInput} from '../../components/SearchInput'
import {IconButton} from '../../components/Buttons'
import {SUBSCRIPTION_PAGE_PATH} from '../../constants'
import {TimeAgo} from '../../components/TimeAgo/TimeAgo'
import {Icon} from '../../components/Icon/Icon'
import {useNavigation} from '../../hooks/navigation'
import {useRouter} from '../../contexts/router'
import {Link} from '../../components/router'

function filterSubscriptions({title}, q = '') {
  return title.toLowerCase().includes(q.toLowerCase())
}

export const SubscriptionListPage = () => {
  const router = useRouter()

  const {
    subscriptions,
    fetchData
  } = useNavigation()

  const onChange = q => {
    router.replaceRoute({
      pathname: router.route.pathname,
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
            value={router.route.searchParams.q}
          />
          <IconButton
            type='redo'
            role='refresh'
            inverse={true}
            onClick={fetchData}
          />
        </>
      }
      listPanel={
        <div
          className='my-subscription-list-page'
        >
          {subscriptions
            .filter(subscription => filterSubscriptions(subscription, router.route.searchParams.q))
            .map(subscription => (
              <div
                key={subscription.uuid}
                className='my-subscription-list-page__item'
              >
                <Link
                  className='my-subscription-list-page__item-heading'
                  to={{
                    pathname: SUBSCRIPTION_PAGE_PATH,
                    search: `?uuid=${subscription.uuid}`,
                  }}
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

