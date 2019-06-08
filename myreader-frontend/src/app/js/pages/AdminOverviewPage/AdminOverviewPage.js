import React from 'react'
import {AdminOverview} from '../../components/AdminOverview/AdminOverview'
import {adminApi} from '../../api'
import {toast} from '../../components/Toast'

export class AdminOverviewPage extends React.Component {

  state = {
    applicationInfo: null
  }

  componentDidMount = async () => {
    try {
      const applicationInfo = await adminApi.fetchApplicationInfo()
      this.setState({applicationInfo})
    } catch {
      toast('Application info is missing')
    }
  }

  rebuildSearchIndex = async () => {
    try {
      await adminApi.rebuildSearchIndex()
      toast('Indexing started')
    } catch (error) {
      toast(error, {error: true})
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
