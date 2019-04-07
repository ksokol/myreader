import './MaintenancePage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Button, TimeAgo} from '../../components'
import {applicationInfoSelector, fetchApplicationInfo, rebuildSearchIndex} from '../../store/admin'

const mapStateToProps = state => ({
  applicationInfo: applicationInfoSelector(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({rebuildSearchIndex, fetchApplicationInfo}, dispatch)

const ApplicationInfo = props =>
  <React.Fragment>
    <h4>Application info</h4>

    <table>
      <tbody>
      <tr>
        <td>Branch</td>
        <td>{props.branch}</td>
      </tr>
      <tr>
        <td>Commit ID</td>
        <td>{props.commitId}</td>
      </tr>
      <tr>
        <td>Version</td>
        <td>{props.version}</td>
      </tr>
      <tr>
        <td>Build Time</td>
        <td>
          <TimeAgo date={props.buildTime}/>
        </td>
      </tr>
      </tbody>
    </table>
  </React.Fragment>

ApplicationInfo.propTypes = {
  branch: PropTypes.string.isRequired,
  commitId: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  buildTime: PropTypes.string.isRequired
}

class MaintenancePage extends React.Component {

  componentDidMount() {
    this.props.fetchApplicationInfo()
  }

  render() {
    const {
      rebuildSearchIndex,
      applicationInfo
    } = this.props

    return (
      <section
        className='my-maintenance'
      >
        <h4>Maintenance</h4>

        <Button
          onClick={rebuildSearchIndex}
          primary>
          Refresh index
        </Button>

        {applicationInfo && applicationInfo.branch && <ApplicationInfo {...applicationInfo} />}
      </section>
    )
  }
}

MaintenancePage.propTypes = {
  rebuildSearchIndex: PropTypes.func.isRequired,
  fetchApplicationInfo: PropTypes.func.isRequired,
  applicationInfo: PropTypes.shape({
    branch: PropTypes.string
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintenancePage)
