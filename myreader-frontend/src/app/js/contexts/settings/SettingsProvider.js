import React from 'react'
import PropTypes from 'prop-types'
import SettingsContext from './SettingsContext'
import {setShowEntryDetails, setShowUnseenEntries, settings} from './settings'

export class SettingsProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  state = settings()

  setShowEntryDetails = showEntryDetails => {
    setShowEntryDetails(showEntryDetails)
    this.setState({
      showEntryDetails
    })
  }

  setShowUnseenEntries = showUnseenEntries => {
    setShowUnseenEntries(showUnseenEntries)
    this.setState({
      showUnseenEntries
    })
  }

  render() {
    const value = {
      ...this.state,
      setShowEntryDetails: this.setShowEntryDetails,
      setShowUnseenEntries: this.setShowUnseenEntries
    }

    return (
      <SettingsContext.Provider
        value={value}
      >{this.props.children}
      </SettingsContext.Provider>
    )
  }
}
