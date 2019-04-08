import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FeedList, ListLayout} from '../../components'
import {filteredBySearchFeedsSelector} from '../../store'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state)
})

const FeedListPage = props =>
  <ListLayout
    listPanel={<FeedList feeds={props.feeds} />}
  />

FeedListPage.propTypes = {
  feeds: PropTypes.any.isRequired
}

export default connect(
  mapStateToProps
)(FeedListPage)
