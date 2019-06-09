import './FeedFetchErrors.css'
import React from 'react'
import PropTypes from 'prop-types'
import {TimeAgo, Button, IntersectionObserver} from '../../components'
import {feedApi} from '../../api'

const Failure = props => (
  <div className='my-feed-fetch-errors__item'>
    <span>{props.message}</span>
    <span><TimeAgo date={props.createdAt}/></span>
  </div>
)

Failure.propTypes = {
  message: PropTypes.string,
  createdAt: PropTypes.string.isRequired
}

export class FeedFetchErrors extends React.Component {

  static propTypes = {
    uuid: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      failures: [],
      links: {
        next: props.uuid
      },
      loading: false
    }
  }

  componentDidMount = async () => {
    await this.fetchFailures()
  }

  fetchFailures = async () => {
    if (this.state.loading) {
      return
    }

    this.setState({
      loading: true
    })

    try {
      const {failures, links} = await feedApi.fetchFeedFetchErrors(this.state.links.next)
      this.setState({
        failures: [...this.state.failures, ...failures],
        links
      })
    } catch {
      // ignore
    } finally {
      this.setState({
        loading: false
      })
    }
  }

  render() {
    const failuresCopy = [...this.state.failures]
    const lastFailure = failuresCopy.pop()
    const hasNextPage = !!this.state.links.next

    return (
      <div className='my-feed-fetch-errors'>
        {this.state.failures.length > 0 ? [
          failuresCopy.map(item => <Failure key={item.uuid} {...item} />),

          lastFailure && hasNextPage
            ? (
              <IntersectionObserver key={lastFailure.uuid} onIntersection={this.fetchFailures}>
                <Failure {...lastFailure} />
              </IntersectionObserver>
            )
            : lastFailure && <Failure key={lastFailure.uuid} {...lastFailure} />,

          hasNextPage && (
            <Button key='load-more'
                    className='my-feed-fetch-errors__load-more'
                    disabled={this.state.loading}
                    onClick={this.fetchFailures}>
              Load More
            </Button>
          )
        ] : <p>no errors</p>}
      </div>
    )
  }
}