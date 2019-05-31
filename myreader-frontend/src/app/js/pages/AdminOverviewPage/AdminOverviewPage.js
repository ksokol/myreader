import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {applicationInfoSelector, fetchApplicationInfo, rebuildSearchIndex} from '../../store'
import {AdminOverview} from '../../components'

const mapStateToProps = state => ({
  applicationInfo: applicationInfoSelector(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({rebuildSearchIndex, fetchApplicationInfo}, dispatch)

class AdminOverviewPage extends React.Component {

  componentDidMount() {
    this.props.fetchApplicationInfo()
  }

  render() {
    const {
      rebuildSearchIndex,
      applicationInfo
    } = this.props

    return (
      <AdminOverview
        rebuildSearchIndex={rebuildSearchIndex}
        applicationInfo={applicationInfo}
      />
    )
  }
}

AdminOverviewPage.propTypes = {
  rebuildSearchIndex: PropTypes.func.isRequired,
  fetchApplicationInfo: PropTypes.func.isRequired,
  applicationInfo: PropTypes.shape({
    branch: PropTypes.string
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminOverviewPage)
