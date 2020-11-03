import React from 'react'
import {Chips} from '../../Chips/Chips'
import PropTypes from 'prop-types'
import {subscriptionExclusionsApi as api} from '../../../api'
import {toast} from '../../Toast'

function byPattern(left, right) {
  if (left.pattern < right.pattern) {
    return -1
  }
  return left.pattern === right.pattern ? 0 : 1
}

export class SubscriptionExclusions extends React.Component {

  static propTypes = {
    subscription: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired
  }

  state = {
    exclusions: [],
    pending: false
  }

  componentDidMount = async () => {
    try {
      this.pendingStart()
      const {content} = await api.fetchExclusions(this.props.subscription.uuid)
      this.setExclusions(content)
    } catch ({data}) {
      toast(data, {error: true})
    } finally {
      this.pendingEnd()
    }
  }

  pendingStart = () => this.setState({pending: true})

  pendingEnd = () => this.setState({pending: false})

  setExclusions = exclusions => this.setState({exclusions: exclusions.sort(byPattern)})

  onAdd = async pattern => {
    try {
      this.pendingStart()
      const exclusion = await api.saveExclusion(this.props.subscription.uuid, pattern)
      this.setExclusions([...this.state.exclusions, exclusion])
    } catch ({data}) {
      toast(data, {error: true})
    } finally {
      this.pendingEnd()
    }
  }

  onRemove = async ({uuid}) => {
    try {
      this.pendingStart()
      await api.removeExclusion(this.props.subscription.uuid, uuid)
      this.setExclusions(this.state.exclusions.filter(exclusion => exclusion.uuid !== uuid))
    } catch ({data}) {
      toast(data, {error: true})
    } finally {
      this.pendingEnd()
    }
  }

  render(props) {
    const {
      exclusions,
      pending
    } = this.state

    return (
      <Chips
        keyFn={itemProps => itemProps.uuid}
        values={exclusions}
        placeholder='Enter an exclusion pattern'
        disabled={pending}
        renderItem={itemProps =>
          <React.Fragment>
            <strong>{itemProps.pattern}</strong>
            &nbsp;
            <em>({itemProps.hitCount})</em>
          </React.Fragment>
        }
        onAdd={this.onAdd}
        onRemove={this.onRemove}
      />
    )
  }
}
