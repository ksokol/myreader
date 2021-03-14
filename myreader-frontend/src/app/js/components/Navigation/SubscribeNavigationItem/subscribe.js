import {useCallback, useState} from 'react'
import {api} from '../../../api'
import {API_2} from '../../../constants'

export function useSubscribe() {
  const [state, setState] = useState({
    pending: false,
    error: null,
    validations: [],
    uuid: null,
  })

  const subscribe = useCallback(async origin => {
    setState(current => ({...current, pending: true, error: null, validations: []}))

    try {
      const {uuid} = await api.post({
        url: `${API_2}/subscriptions`,
        body: {origin}
      })
      setState(current => ({...current, uuid, pending: false}))
    } catch (error) {
      if (error.status === 400) {
        setState(current => ({...current, pending: false, validations: error.data.errors}))
      } else {
        setState(current => ({...current, pending: false, error: error.data}))
      }
    }
  }, [])

  return {
    pending: state.pending,
    error: state.error,
    uuid: state.uuid,
    validations: state.validations,
    subscribe,
  }
}
