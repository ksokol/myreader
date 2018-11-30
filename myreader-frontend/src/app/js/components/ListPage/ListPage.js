import './ListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {SearchInput, IconButton} from '../../components'

const ListPage = props => {
  const {
    onSearchChange,
    onRefresh,
    actionPanel,
    listPanel,
    router: {query}
  } = props

  return (
    <div className='my-list-page'>
      <div className='my-list-page__action-panel'>
        <SearchInput className='my-list-page__search-input'
                     onChange={q => onSearchChange({...query, q})}
                     value={query.q} />
        {actionPanel}
        <IconButton type='redo' onClick={onRefresh} />
      </div>

      <div className='my-list-page__list-panel'>
        <div className='my-list-page__list-content'>
          {listPanel}
        </div>
      </div>
    </div>
  )
}

ListPage.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      q: PropTypes.string
    }).isRequired
  }).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  actionPanel: PropTypes.node,
  listPanel: PropTypes.node,
}

export default ListPage
