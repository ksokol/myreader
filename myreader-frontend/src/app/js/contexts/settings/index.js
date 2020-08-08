import {useContext} from 'react'
import SettingsContext from './SettingsContext'

export function useSettings() {
  return useContext(SettingsContext)
}
