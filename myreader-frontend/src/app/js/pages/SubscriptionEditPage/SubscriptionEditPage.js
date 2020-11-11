import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {SubscriptionEditForm} from '../../components'
import {SUBSCRIPTIONS_URL} from '../../constants'
import {toast} from '../../components/Toast'
import {useSubscription} from './subscription'
import {useHistory} from '../../hooks/router'

export function SubscriptionEditPage() {
  const {uuid} = useParams()
  const {
    reload,
    replace
  } = useHistory()

  const {
    subscription,
    subscriptionTags,
    loading,
    updated,
    deleted,
    validations,
    lastError,
    loadSubscription,
    saveSubscription,
    deleteSubscription,
  } = useSubscription()

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
      reload()
      toast('Subscription saved')
    }
  }, [reload, updated])

  useEffect(() => {
    if (deleted) {
      toast('Subscription deleted')
      reload()
      replace({pathname: SUBSCRIPTIONS_URL})
    }
  }, [deleted, reload, replace])

  return subscription ? (
    <SubscriptionEditForm
      data={subscription}
      subscriptionTags={subscriptionTags}
      changePending={loading}
      validations={validations}
      saveSubscriptionEditForm={saveSubscription}
      deleteSubscription={deleteSubscription}
    />
  ) : null
}
