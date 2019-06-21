import React from 'react'
import PropTypes from 'prop-types'
import SettingsContext from './SettingsContext'
import {connect} from 'react-redux'
import {getSettings} from '../../store'

class Provider extends React.Component {

  static propTypes = {
    pageSize: PropTypes.number.isRequired,
    showUnseenEntries: PropTypes.bool.isRequired,
    showEntryDetails: PropTypes.bool.isRequired,
    children: PropTypes.any
  }

  render() {
    const {
      pageSize,
      showUnseenEntries,
      showEntryDetails
    } = this.props

    return (
      <SettingsContext.Provider
        value={{pageSize, showUnseenEntries, showEntryDetails}}
      >{this.props.children}
      </SettingsContext.Provider>
    )
  }
}

export const SettingsProvider = connect(
  getSettings
)(Provider)
