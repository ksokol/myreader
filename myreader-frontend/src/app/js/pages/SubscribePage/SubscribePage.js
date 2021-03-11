import React, {useCallback, useState} from 'react'
import {SubscribeForm} from '../../components'
import {SUBSCRIPTION_PAGE_PATH} from '../../constants'
import {subscriptionApi} from '../../api'
import {toast} from '../../components/Toast'
import {useHistory} from '../../hooks/router'

export function SubscribePage() {
  const [pending, setPending] = useState(false)
  const [validations, setValidations] = useState([])
  const {replace} = useHistory()

  const onSaveNewSubscription = useCallback(async subscription => {
    setPending(true)
    setValidations([])

    try {
      const {uuid} = await subscriptionApi.subscribe(subscription)
      toast('Subscribed')
      replace({pathname: SUBSCRIPTION_PAGE_PATH, params: {uuid}})
    } catch (error) {
      setPending(false)

      if (error.status === 400) {
        setValidations(error.data.errors)
      }

      if (error.status !== 400) {
        toast(error.data, {error: true})
      }
    }
  }, [replace])

  return (
    <SubscribeForm
      changePending={pending}
      validations={validations}
      saveSubscribeEditForm={onSaveNewSubscription}
    />
  )
}
