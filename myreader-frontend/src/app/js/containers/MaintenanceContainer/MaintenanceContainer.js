import React from 'react'
import {connect} from 'react-redux'
import {applicationInfoSelector, rebuildSearchIndex} from '../../store'
import {Maintenance} from '../../components'

const mapStateToProps = state => ({
  applicationInfo: applicationInfoSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefreshIndex: () => dispatch(rebuildSearchIndex())
})

const MaintenanceContainer = props => <Maintenance {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintenanceContainer)
