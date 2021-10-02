import {useContext} from 'react'
import NavigationContext from '../contexts/navigation/NavigationContext'

export function useNavigation() {
  return useContext(NavigationContext)
}
