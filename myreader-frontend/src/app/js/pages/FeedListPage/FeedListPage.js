import React from 'react'
import PropTypes from 'prop-types'
import {FeedList, ListLayout} from '../../components'
import {feedApi} from '../../api'
import {withNotification} from '../../contexts'

class FeedListPage extends React.Component {

  static propTypes = {
    showErrorNotification: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      feeds: []
    }
  }

  componentDidMount = async () => {
    try {
      const feeds = await feedApi.fetchFeeds()
      this.setState({feeds})
    } catch (error) {
      this.props.showErrorNotification(error)
    }
  }

  render() {
    return (
      <ListLayout
        listPanel={<FeedList feeds={this.state.feeds} />}
      />
    )
  }
}

export default withNotification(FeedListPage)
