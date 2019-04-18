import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {FeedList, ListLayout} from '../../components'
import {fetchFeeds, filteredBySearchFeedsSelector} from '../../store'
import {toQueryObject} from '../../shared/location-utils'

const mapStateToProps = (state, ownProps) => ({
  ...filteredBySearchFeedsSelector(toQueryObject(ownProps.location).q)(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetchFeeds}, dispatch)

class FeedListPage extends React.Component {

  static propTypes = {
    feeds: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    fetchFeeds: PropTypes.func.isRequired
  }

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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FeedListPage)
)
