import React from 'react'
import {FeedList, ListLayout} from '../../components'
import {feedApi} from '../../api'
import {toast} from '../../components/Toast'

export class FeedListPage extends React.Component {

  state = {
    feeds: []
  }

  componentDidMount = async () => {
    try {
      const feeds = await feedApi.fetchFeeds()
      this.setState({feeds})
    } catch (error) {
      toast(error, {error: true})
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
