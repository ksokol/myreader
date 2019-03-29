import React from 'react'
import PropTypes from 'prop-types'
import {FeedList, ListLayout} from '../../components'

const FeedListPage = props =>
  <ListLayout
    listPanel={<FeedList feeds={props.feeds} />}
  />

FeedListPage.propTypes = {
  feeds: PropTypes.any.isRequired
}

export default FeedListPage
