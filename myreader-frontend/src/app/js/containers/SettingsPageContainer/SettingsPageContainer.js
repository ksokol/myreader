import React from 'react'
import {connect} from 'react-redux'
import {getSettings, updateSettings} from '../../store'
import {SettingsPage} from '../../pages'

const mapStateToProps = state => ({
  settings: getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  onChange: settings => dispatch(updateSettings(settings))
})

const SettingsPageContainer = props => <SettingsPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPageContainer)
