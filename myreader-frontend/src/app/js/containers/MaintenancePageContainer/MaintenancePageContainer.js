import React from 'react'
import {connect} from 'react-redux'
import {applicationInfoSelector, rebuildSearchIndex} from '../../store'
import {MaintenancePage} from '../../pages'

const mapStateToProps = state => ({
  applicationInfo: applicationInfoSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefreshIndex: () => dispatch(rebuildSearchIndex())
})

const MaintenancePageContainer = props => <MaintenancePage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintenancePageContainer)
