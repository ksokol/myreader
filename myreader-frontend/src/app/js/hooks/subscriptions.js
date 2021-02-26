import {useContext} from 'react'
import SubscriptionContext from '../contexts/subscription/SubscriptionContext'

export function useSubscriptions() {
  return useContext(SubscriptionContext)
}
