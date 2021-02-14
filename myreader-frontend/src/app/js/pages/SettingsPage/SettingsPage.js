import './SettingsPage.css'
import React from 'react'
import Option from '../../components/Option/Option'
import {useSettings} from '../../contexts/settings'

const unseenEntriesOptions = [{label: 'show', value: false}, {label: 'hide', value: true}]
const entryDetailsOptions = [{label: 'show', value: true}, {label: 'hide', value: false}]

export const SettingsPage = () => {
  const {
    showUnseenEntries,
    showEntryDetails,
    setShowEntryDetails,
    setShowUnseenEntries,
  } = useSettings()

  return (
    <div
      className='my-settings'
    >
      <div
        className='my-settings__item'
      >
        <label>Old entries</label>
        <Option
          value={showUnseenEntries}
          options={unseenEntriesOptions}
          onSelect={setShowUnseenEntries}
        />
      </div>

      <div
        className='my-settings__item'
      >
        <label>Entry content</label>
        <Option
          value={showEntryDetails}
          options={entryDetailsOptions}
          onSelect={setShowEntryDetails}
        />
      </div>
    </div>
  )
}
