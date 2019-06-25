import React from 'react'
import PropTypes from 'prop-types'
import SettingsContext from './SettingsContext'
import {setPageSize, setShowEntryDetails, setShowUnseenEntries, settings} from './settings'

export class SettingsProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  state = settings()

  setPageSize = pageSize => {
    setPageSize(pageSize)
    this.setState({
      pageSize
    })
  }

  setShowEntryDetails = showUnseenEntries => {
    setShowEntryDetails(showUnseenEntries)
    this.setState({
      showUnseenEntries
    })
  }

  setShowUnseenEntries = showEntryDetails => {
    setShowUnseenEntries(showEntryDetails)
    this.setState({
      showEntryDetails
    })
  }

  render() {
    const value = {
      ...this.state,
      setPageSize: this.setPageSize,
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
