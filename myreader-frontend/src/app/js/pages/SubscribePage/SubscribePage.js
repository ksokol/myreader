import React, {useCallback, useState} from 'react'
import {generatePath, useHistory} from 'react-router'
import {SubscribeForm} from '../../components'
import {API_2, SUBSCRIPTION_PAGE_PATH} from '../../constants'
import {api} from '../../api'
import {toast} from '../../components/Toast'

export function SubscribePage() {
  const [pending, setPending] = useState(false)
  const [validations, setValidations] = useState([])
  const history = useHistory()

  const onSaveNewSubscription = useCallback(async subscription => {
    setPending(true)
    setValidations([])

    try {
      const {uuid} = await api.post({
        url: `${API_2}/subscriptions`,
        body: subscription
      })
      toast('Subscribed')
      history.replace({
        pathname: generatePath(SUBSCRIPTION_PAGE_PATH, {uuid})
      })
    } catch (error) {
      setPending(false)

      if (error.status === 400) {
        setValidations(error.data.errors)
      }

      if (error.status !== 400) {
        toast(error.data, {error: true})
      }
    }
  }, [history])

  return (
    <SubscribeForm
      changePending={pending}
      validations={validations}
      saveSubscribeEditForm={onSaveNewSubscription}
    />
  )
}
