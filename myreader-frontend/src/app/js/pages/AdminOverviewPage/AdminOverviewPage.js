import React, {useEffect, useState} from 'react'
import {adminApi} from '../../api'
import {toast} from '../../components/Toast'
import {TimeAgo} from '../../components/TimeAgo/TimeAgo'

export function AdminOverviewPage() {
  const [applicationInfo, setApplicationInfo] = useState(null)

  useEffect(() => {
    async function run() {
      try {
        setApplicationInfo(await adminApi.fetchApplicationInfo())
      } catch {
        toast('Application info is missing')
      }
    }
    run()
  }, [])

  return (
    <section
      className='p-2.5'
    >
      {applicationInfo ? (
        <React.Fragment>
          <h4>Application info</h4>
          <table data-testid='application-info'>
            <tbody>
              <tr>
                <td>Branch</td>
                <td>{applicationInfo.branch}</td>
              </tr>
              <tr>
                <td>Commit ID</td>
                <td>{applicationInfo.commitId}</td>
              </tr>
              <tr>
                <td>Version</td>
                <td>{applicationInfo.version}</td>
              </tr>
              <tr>
                <td>Build Time</td>
                <td>
                  <TimeAgo date={applicationInfo.buildTime}/>
                </td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ) : null}
    </section>
  )
}
