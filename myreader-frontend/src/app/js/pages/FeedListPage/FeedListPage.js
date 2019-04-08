import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {FeedList, ListLayout} from '../../components'
import {fetchFeeds, filteredBySearchFeedsSelector} from '../../store'

const mapStateToProps = state => ({
  ...filteredBySearchFeedsSelector(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetchFeeds}, dispatch)

class FeedListPage extends React.Component {

  componentDidMount() {
    this.props.fetchFeeds()
  }

  render() {
    return (
      <ListLayout
        listPanel={<FeedList feeds={this.props.feeds} />}
      />
    )
  }
}

FeedListPage.propTypes = {
  feeds: PropTypes.any.isRequired,
  fetchFeeds: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedListPage)
