import {useEffect} from 'react'
import {SubscriptionEditForm} from './SubscriptionEditForm/SubscriptionEditForm'
import {SUBSCRIPTIONS_PAGE_PATH} from '../../constants'
import {toast} from '../../components/Toast'
import {useSubscription} from './subscription'
import {useNavigation} from '../../hooks/navigation'
import {useRouter} from '../../contexts/router'

export function SubscriptionPage() {
  const {route, replaceRoute} = useRouter()

  const {
    subscription,
    subscriptionTags,
    exclusionPatterns,
    fetchErrors,
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
    <SubscriptionEditForm
      data={subscription}
      subscriptionTags={subscriptionTags}
      exclusionPatterns={exclusionPatterns}
      fetchErrors={fetchErrors}
      changePending={loading}
      validations={validations}
      saveSubscriptionEditForm={saveSubscription}
      deleteSubscription={deleteSubscription}
      addExclusionPattern={addExclusionPattern}
      removeExclusionPattern={removeExclusionPattern}
    />
  ) : null
}
