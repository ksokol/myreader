import './AdminOverview.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, TimeAgo} from '../../components'

const ApplicationInfo = props => (
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
)

ApplicationInfo.propTypes = {
  branch: PropTypes.string.isRequired,
  commitId: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  buildTime: PropTypes.string.isRequired
}

export const AdminOverview = ({rebuildSearchIndex, applicationInfo}) => (
  <section
    className='my-admin-overview'
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

AdminOverview.propTypes = {
  rebuildSearchIndex: PropTypes.func.isRequired,
  applicationInfo: PropTypes.shape({
    branch: PropTypes.string
  })
}
