import React, {useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {SubscriptionEditForm} from './SubscriptionEditForm/SubscriptionEditForm'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {toast} from '../../components/Toast'
import {useSubscription} from './subscription'
import {useSubscriptions} from '../../hooks/subscriptions'

export function SubscriptionPage() {
  const {uuid} = useParams()
  const {
    replace
  } = useHistory()

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
    fetchSubscriptions
  } = useSubscriptions()

  useEffect(() => {
    if (uuid) {
      loadSubscription(uuid)
    }
  }, [loadSubscription, uuid])

  useEffect(() => {
    if (lastError) {
      toast(lastError.data, {error: true})
    }
  }, [lastError])

  useEffect(() => {
    if (updated) {
      fetchSubscriptions()
      toast('Updated')
    }
  }, [fetchSubscriptions, updated])

  useEffect(() => {
    if (deleted) {
      toast('Subscription deleted')
      fetchSubscriptions()
      replace(SUBSCRIPTIONS_URL)
    }
  }, [deleted, fetchSubscriptions, replace])

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
