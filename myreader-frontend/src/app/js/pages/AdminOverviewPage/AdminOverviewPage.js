import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {applicationInfoSelector, fetchApplicationInfo} from '../../store'
import {AdminOverview} from '../../components'
import {adminApi} from '../../api'
import {withNotification} from '../../contexts'

const mapStateToProps = state => ({
  applicationInfo: applicationInfoSelector(state)
})

class AdminOverviewPage extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchApplicationInfo())
  }

  rebuildSearchIndex = async () => {
    try {
      await adminApi.rebuildSearchIndex()
      this.props.showSuccessNotification('Indexing started')
    } catch (error) {
      this.props.showErrorNotification(error)
    }
  }

  render() {
    return (
      <AdminOverview
        rebuildSearchIndex={this.rebuildSearchIndex}
        applicationInfo={this.props.applicationInfo}
      />
    )
  }
}

AdminOverviewPage.propTypes = {
  applicationInfo: PropTypes.shape({
    branch: PropTypes.string
  }),
  showSuccessNotification: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default withNotification(
  connect(
    mapStateToProps
  )(AdminOverviewPage)
)
