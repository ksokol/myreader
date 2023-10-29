import {useState} from 'react'
import SettingsContext from './SettingsContext'
import {setShowEntryDetails, setShowUnseenEntries, settings} from './settings'

export function SettingsProvider({children}) {
  const [state, setState] = useState(settings())

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        setShowEntryDetails: showEntryDetails => {
          setShowEntryDetails(showEntryDetails)
          setState(current => ({
            ...current,
            showEntryDetails
          }))
        },
        setShowUnseenEntries: showUnseenEntries => {
          setShowUnseenEntries(showUnseenEntries)
          setState(current => ({
            ...current,
            showUnseenEntries
          }))
        }
      }}
    >{children}
    </SettingsContext.Provider>
  )
}
