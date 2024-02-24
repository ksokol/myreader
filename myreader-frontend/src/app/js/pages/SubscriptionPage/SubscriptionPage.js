import {useEffect} from 'react'
import {SubscriptionEditForm} from './SubscriptionEditForm/SubscriptionEditForm'
import {SUBSCRIPTIONS_PAGE_PATH} from '../../constants'
import {toast} from '../../components/Toast'
import {useSubscription} from './subscription'
import {useNavigation} from '../../hooks/navigation'
import {useRouter} from '../../contexts/router'
import {TimeAgo} from '../../components/TimeAgo/TimeAgo'

export function SubscriptionPage() {
  const {route, replaceRoute} = useRouter()

  const {
    subscription,
    subscriptionTags,
    exclusionPatterns,
    loading,
    updated,
    deleted,
    validations,
    lastError,
    loadSubscription,
    saveSubscription,
    deleteSubscription,
    addExclusionPattern,
    removeExclusionPattern,
  } = useSubscription()

  const {
    fetchData
  } = useNavigation()

  useEffect(() => {
    if (route.searchParams.uuid) {
      loadSubscription(route.searchParams.uuid)
    }
  }, [loadSubscription, route.searchParams.uuid])

  useEffect(() => {
    if (lastError) {
      toast(lastError.data, {error: true})
    }
  }, [lastError])

  useEffect(() => {
    if (updated) {
      fetchData()
      toast('Updated')
    }
  }, [fetchData, updated])

  useEffect(() => {
    if (deleted) {
      toast('Subscription deleted')
      fetchData()
      replaceRoute({pathname: SUBSCRIPTIONS_PAGE_PATH})
    }
  }, [deleted, fetchData, replaceRoute])

  return subscription ? (
    <>
      <SubscriptionEditForm
        data={subscription}
        subscriptionTags={subscriptionTags}
        exclusionPatterns={exclusionPatterns}
        changePending={loading}
        validations={validations}
        saveSubscriptionEditForm={saveSubscription}
        deleteSubscription={deleteSubscription}
        addExclusionPattern={addExclusionPattern}
        removeExclusionPattern={removeExclusionPattern}
      />
      <section>
        <h2>Last fetch error</h2>
        <span>{subscription.lastErrorMessage ?? 'n/a'}</span><br />
        {subscription.lastErrorMessageDatetime && <span><TimeAgo date={subscription.lastErrorMessageDatetime}/></span>}
      </section>
    </>
  ) : null
}
