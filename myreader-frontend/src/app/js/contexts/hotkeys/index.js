import {useContext} from 'react'
import HotkeysContext from './HotkeysContext'

export function useHotkeys() {
  return useContext(HotkeysContext)
}
