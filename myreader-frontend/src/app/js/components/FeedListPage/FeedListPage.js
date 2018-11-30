import React from 'react'
import PropTypes from 'prop-types'
import {ListPage} from '..'
import FeedList from './FeedList/FeedList'

const FeedListPage = props =>
  <ListPage router={props.router}
            onSearchChange={props.onSearchChange}
            onRefresh={props.onRefresh}
            listPanel={<FeedList feeds={props.feeds}
                                 navigateTo={props.navigateTo} />} />

FeedListPage.propTypes = {
  router: PropTypes.any.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  feeds: PropTypes.any.isRequired,
  navigateTo: PropTypes.func.isRequired
}

export default FeedListPage
