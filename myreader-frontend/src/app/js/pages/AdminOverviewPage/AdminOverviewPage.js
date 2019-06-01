import React from 'react'
import PropTypes from 'prop-types'
import {AdminOverview} from '../../components'
import {adminApi} from '../../api'
import {withNotification} from '../../contexts'

class AdminOverviewPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      applicationInfo: null
    }
  }

  componentDidMount = async () => {
    try {
      const applicationInfo = await adminApi.fetchApplicationInfo()
      this.setState({applicationInfo})
    } catch {
      this.props.showErrorNotification('Application info is missing')
    }
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
        applicationInfo={this.state.applicationInfo}
      />
    )
  }
}

AdminOverviewPage.propTypes = {
  showSuccessNotification: PropTypes.func.isRequired,
  showErrorNotification: PropTypes.func.isRequired
}

export default withNotification(AdminOverviewPage)
