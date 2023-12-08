import {useState} from 'react'
import {NavigationItem} from '../NavigationItem'
import {Dialog} from '../../Dialog/Dialog'
import {useSettings} from '../../../contexts/settings'

function Toggle({
  label,
  checked,
  onChange
}) {
  return (
    <>
      <span>{label}</span>
      <div
        className='my-settings__switch'
      >
        <input
          id={label}
          type='checkbox'
          className='my-settings__switch-input'
          defaultChecked={checked === true}
          onChange={onChange}
        />
        <label
          htmlFor={label}
          className='my-settings__switch-label'
        >
          {label}
        </label>
      </div>
    </>
  )
}

function SettingsDialog({onClose}) {
  const {
    showUnseenEntries,
    showEntryDetails,
    setShowUnseenEntries,
    setShowEntryDetails,
  } = useSettings()

  const body = (
    <div
      className='my-settings'
    >
      <div
        className='my-settings__item'
      >
        <Toggle
          label='Show all entries'
          checked={showUnseenEntries === false}
          onChange={() => setShowUnseenEntries(!showUnseenEntries)}
        />
      </div>

      <div
        className='my-settings__item'
      >
        <Toggle
          label='Show entry content'
          checked={showEntryDetails === true}
          onChange={() => setShowEntryDetails(!showEntryDetails)}
        />
      </div>
    </div>
  )

  return (
    <Dialog
      body={body}
      onClickClose={onClose}
    >
    </Dialog>
  )
}

export function SettingsNavigationItem({onClick}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const onCloseDialog = () => {
    setDialogOpen(false)
    onClick()
  }

  return (
    <>
      {dialogOpen && <SettingsDialog onClose={onCloseDialog} />}
      <NavigationItem
        title='Settings'
        to={{}}
        onClick={event => {
          event.preventDefault()
          setDialogOpen(true)
        }}
      />
    </>
  )
}
