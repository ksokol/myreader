import './BookmarkListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Chips, EntryList, ListLayout} from '../../components'

const BookmarkListPage = props => {
  const {
    router,
    entryTags,
    onSearchChange,
    onRefresh,
    entries,
    links,
    loading,
    showEntryDetails,
    isDesktop,
    onChangeEntry,
    onLoadMore
  } = props

  return (
    <ListLayout className='my-bookmark-list'
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
                         renderItem={props => props}
                  />
                  <EntryList isDesktop={isDesktop}
                             showEntryDetails={showEntryDetails}
                             entries={entries}
                             links={links}
                             loading={loading}
                             onChangeEntry={onChangeEntry}
                             onLoadMore={onLoadMore}
                  />
                </React.Fragment>
              }
    />
  )
}

BookmarkListPage.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      entryTagEqual: PropTypes.string
    })
  }).isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.any
  ).isRequired,
  entryTags: PropTypes.any.isRequired,
  links: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  showEntryDetails: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired
}

export default BookmarkListPage



