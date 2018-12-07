import './BookmarkListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Chips, ListPage} from '../../components'
import {EntryListContainer} from '../../containers'

const BookmarkListPage = ({router, entryTags, onSearchChange, onRefresh}) => (
  <ListPage className='my-bookmark-list'
            router={router}
            onSearchChange={onSearchChange}
            onRefresh={() => onRefresh(router.query)}
            listPanel={
              <React.Fragment>
                <Chips keyFn={props => props}
                       className='my-bookmark-list__tags'
                       values={entryTags}
                       selected={router.query.entryTagEqual}
                       onSelect={entryTagEqual => onSearchChange({...router.query, entryTagEqual})}
                       renderItem={props => props} />
                <EntryListContainer />
              </React.Fragment>
            } />
)

BookmarkListPage.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      entryTagEqual: PropTypes.string
    })
  }).isRequired,
  entryTags: PropTypes.any.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
}

export default BookmarkListPage



