import './SubscriptionFetchErrors.css'
import React from 'react'
import PropTypes from 'prop-types'
import {TimeAgo} from '../../TimeAgo/TimeAgo'
import {subscriptionApi} from '../../../api'

export class SubscriptionFetchErrors extends React.Component {

  static propTypes = {
    uuid: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      failures: [],
      loading: false,
    }
  }

  componentDidMount = async () => {
    if (this.state.loading) {
      return
    }

    this.setState({
      loading: true
    })

    try {
      const failures = await subscriptionApi.fetchFeedFetchErrors(this.props.uuid)
      this.setState({
        failures,
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
    return (
      <div className='my-subscription-fetch-errors'>
        {this.state.failures.length > 0 ? (
          this.state.failures.map(item => (
            <div
              key={item.uuid}
              className='my-subscription-fetch-errors__item'
            >
              <span>{item.message}</span>
              <span><TimeAgo date={item.createdAt}/></span>
            </div>
          ))
        ) : <p>no errors</p>}
      </div>
    )
  }
}
