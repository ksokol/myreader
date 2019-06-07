import React from 'react'
import {Chips} from '../..'
import PropTypes from 'prop-types'

export class SubscriptionExclusions extends React.Component {

  static propTypes = {
    subscription: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired,
    exclusions: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        pattern: PropTypes.string.isRequired,
        hitCount: PropTypes.number.isRequired,
      })
    ),
    changePending: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  render(props) {
    const {
      subscription,
      exclusions,
      changePending,
      onAdd,
      onRemove,
    } = this.props

    return (
      <Chips
        keyFn={itemProps => itemProps.uuid}
        values={exclusions}
        placeholder='Enter an exclusion pattern'
        disabled={changePending}
        renderItem={itemProps =>
          <React.Fragment>
            <strong>{itemProps.pattern}</strong>
            &nbsp;
            <em>({itemProps.hitCount})</em>
          </React.Fragment>
        }
        onAdd={tag => onAdd(subscription.uuid, tag)}
        onRemove={({uuid}) => onRemove(subscription.uuid, uuid)}
      />
    )
  }
}
