import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {FeedList, ListLayout} from '../../components'
import {withLocationState} from '../../contexts'
import {fetchFeeds, feedsSelector} from '../../store'

const mapStateToProps = state => ({
  ...feedsSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({fetchFeeds}, dispatch)

class FeedListPage extends React.Component {

  static propTypes = {
    feeds: PropTypes.any.isRequired,
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

export default withLocationState(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FeedListPage)
)
