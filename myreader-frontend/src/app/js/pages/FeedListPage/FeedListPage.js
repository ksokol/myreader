import React from 'react'
import {feedApi} from '../../api'
import {toast} from '../../components/Toast'
import {FeedList} from '../../components/FeedList/FeedList'
import {ListLayout} from '../../components/ListLayout/ListLayout'

export class FeedListPage extends React.Component {

  state = {
    feeds: []
  }

  componentDidMount = async () => {
    try {
      const feeds = await feedApi.fetchFeeds()
      this.setState({feeds})
    } catch ({data}) {
      toast(data, {error: true})
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
