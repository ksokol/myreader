import React from 'react'

function getAttribute(name) {
  return document.querySelector('head').getAttribute(name)
}

export function AdminOverviewPage() {
  return (
    <section>
      <h4>Application info</h4>
      <table>
        <tbody>
          <tr>
            <td>Commit ID</td>
            <td>{getAttribute('data-build-commit-id')}</td>
          </tr>
          <tr>
            <td>Version</td>
            <td>{getAttribute('data-build-version')}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}
