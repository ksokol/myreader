import './ListLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {SearchInput, IconButton} from '..'
import {useSearchParams, useHistory} from '../../hooks/router'

export function ListLayout(props) {
  const searchParams = useSearchParams()
  const {push, reload} = useHistory()

  const onChange = q => {
    push({
      searchParams: {
        ...searchParams,
        q
      }
    })
  }

  const {
    className,
    actionPanel,
    listPanel,
  } = props

  return (
    <div
      className={`my-list-layout ${className}`}
    >
      <div
        className='my-list-layout__action-panel'
      >
        <SearchInput
          className='my-list-layout__search-input'
          onChange={onChange}
          value={searchParams.q}
        />
        {actionPanel}
        <IconButton
          type='redo'
          onClick={reload}
        />
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
