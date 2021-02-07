import './ListLayout.css'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

function ActionPanelPortal({children}) {
  const portal = document.querySelector('#portal-header')

  return portal ? ReactDOM.createPortal(
    children,
    portal
  ) : null
}

export function ListLayout({
  className,
  actionPanel,
  listPanel,
}) {
  return (
    <div
      className={`my-list-layout ${className ? className : ''}`}
    >
      <ActionPanelPortal>{actionPanel}</ActionPanelPortal>
      <div
        className='my-list-layout__list-panel'
      >
        <div
          className='my-list-layout__list-content'
        >
          {listPanel}
        </div>
      </div>
    </div>
  )
}

ListLayout.propTypes = {
  className: PropTypes.string,
  actionPanel: PropTypes.node,
  listPanel: PropTypes.node,
}
