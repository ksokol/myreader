import React from 'react'
import PropTypes from 'prop-types'
import {FeedList, ListLayout} from '../../components'

const FeedListPage = props =>
  <ListLayout
    onSearchChange={props.onSearchChange}
    onRefresh={props.onRefresh}
    listPanel={<FeedList feeds={props.feeds} />}
  />

FeedListPage.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  feeds: PropTypes.any.isRequired
}

export default FeedListPage
