import './Settings.css'
import React from 'react'
import PropTypes from 'prop-types'
import Option from './Option/Option'
import {SubscriptionTagsContainer} from '../../containers'

const pageSizeOptions = [10, 20, 30]
const unseenEntriesOptions = [{label: 'show', value: false}, {label: 'hide', value: true}]
const entryDetailsOptions = [{label: 'show', value: true}, {label: 'hide', value: false}]

const Settings = props =>
  <div className='my-settings'>
    <div className='my-settings__item'>
      <label>Page size</label>
      <Option
        value={props.settings.pageSize}
        options={pageSizeOptions}
        onSelect={pageSize => props.onChange({...props.settings, pageSize})} />
    </div>

    <div className='my-settings__item'>
      <label>Old entries</label>
      <Option
        value={props.settings.showUnseenEntries}
        options={unseenEntriesOptions}
        onSelect={showUnseenEntries => props.onChange({...props.settings, showUnseenEntries})} />
    </div>

    <div className='my-settings__item'>
      <label>Entry content</label>
      <Option
        value={props.settings.showEntryDetails}
        options={entryDetailsOptions}
        onSelect={showEntryDetails => props.onChange({...props.settings, showEntryDetails})} />
    </div>

    <div className='my-settings__item'>
      <label>Subscription Tags</label>
      <SubscriptionTagsContainer />
    </div>
  </div>

Settings.propTypes = {
  settings: PropTypes.shape({
    pageSize: PropTypes.oneOf(pageSizeOptions).isRequired,
    showUnseenEntries: PropTypes.bool.isRequired,
    showEntryDetails: PropTypes.bool.isRequired
  }),
  onChange: PropTypes.func.isRequired
}

export default Settings
