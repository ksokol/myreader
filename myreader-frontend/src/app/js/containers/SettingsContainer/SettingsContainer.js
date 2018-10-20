import React from 'react'
import {connect} from 'react-redux'
import {getSettings, updateSettings} from '../../store'
import {Settings} from '../../components'

const mapStateToProps = state => ({
  settings: getSettings(state)
})

const mapDispatchToProps = dispatch => ({
  onChange: settings => dispatch(updateSettings(settings))
})

const SettingsContainer = props => <Settings {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
