import React from 'react'
import PropTypes from 'prop-types'
import {FeedList, ListLayout} from '../../components'

const FeedListPage = props =>
  <ListLayout
    onRefresh={props.onRefresh}
    listPanel={<FeedList feeds={props.feeds} />}
  />

FeedListPage.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  feeds: PropTypes.any.isRequired
}

export default FeedListPage
