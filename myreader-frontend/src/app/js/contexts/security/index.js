import {useContext} from 'react'
import SecurityContext from './SecurityContext'

export function useSecurity() {
  return useContext(SecurityContext)
}
