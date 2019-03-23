import './ListLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {SearchInput, IconButton} from '../../components'
import {withRouter} from 'react-router-dom'
import {toQueryObject} from '../../shared/location-utils'

const ListLayout = props => {
  const {
    className,
    onSearchChange,
    onRefresh,
    actionPanel,
    listPanel,
    location
  } = props
  const query = toQueryObject(location)

  return (
    <div
      className={classNames('my-list-layout', className)}
    >
      <div
        className='my-list-layout__action-panel'
      >
        <SearchInput
          className='my-list-layout__search-input'
          onChange={q => onSearchChange({...query, q})}
          value={query.q}
        />
          {actionPanel}
        <IconButton
          type='redo'
          onClick={onRefresh}
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
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  actionPanel: PropTypes.node,
  listPanel: PropTypes.node,
}

export default withRouter(ListLayout)
