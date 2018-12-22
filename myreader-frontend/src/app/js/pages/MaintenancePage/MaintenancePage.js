import './MaintenancePage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, TimeAgo} from '../../components'

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

const MaintenancePage = props =>
  <section className='my-maintenance'>
    <h4>Maintenance</h4>

    <Button onClick={props.onRefreshIndex} primary>Refresh index</Button>

    {props.applicationInfo && props.applicationInfo.branch && <ApplicationInfo {...props.applicationInfo} />}
  </section>

MaintenancePage.propTypes = {
  onRefreshIndex: PropTypes.func.isRequired,
  applicationInfo: PropTypes.shape({
    branch: PropTypes.string
  })
}

export default MaintenancePage
