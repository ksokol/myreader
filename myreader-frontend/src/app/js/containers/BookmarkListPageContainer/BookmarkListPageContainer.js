import React from 'react'
import {connect} from 'react-redux'
import {fetchEntries, getEntryTags, routeChange, routeSelector} from '../../store'
import {BookmarkListPage} from '../../components'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

const mapStateToProps = state => ({
  ...getEntryTags(state),
  ...routeSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onRefresh: query => dispatch(fetchEntries({path: SUBSCRIPTION_ENTRIES, query})),
  onSearchChange: query => dispatch(routeChange(['app', 'bookmarks'], query))
})

const BookmarkListPageContainer = props => <BookmarkListPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarkListPageContainer)
