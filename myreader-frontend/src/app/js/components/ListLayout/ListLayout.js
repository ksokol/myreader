import './ListLayout.css'
import React from 'react'
import PropTypes from 'prop-types'

export function ListLayout({
  className,
  actionPanel,
  listPanel,
}) {
  return (
    <div
      className={`my-list-layout ${className}`}
    >
      <div
        className='my-list-layout__action-panel'
      >
        {actionPanel}
      </div>
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
