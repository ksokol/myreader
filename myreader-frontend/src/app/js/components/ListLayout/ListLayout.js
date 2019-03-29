import './ListLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {SearchInput, IconButton} from '../../components'
import {withRouter} from 'react-router-dom'
import {toQueryObject, withQuery} from '../../shared/location-utils'

const ListLayout = props => {
  const {
    className,
    actionPanel,
    listPanel,
    location,
    history
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
          onChange={q => history.push(withQuery(location, {...query, q}))}
          value={query.q}
        />
          {actionPanel}
        <IconButton
          type='redo'
          onClick={() => history.replace(withQuery(location, query, {reload: true}))}
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
  actionPanel: PropTypes.node,
  listPanel: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired
}

export default withRouter(ListLayout)
