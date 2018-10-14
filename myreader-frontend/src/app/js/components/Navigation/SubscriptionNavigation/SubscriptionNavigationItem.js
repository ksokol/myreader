import './SubscriptionNavigationItem.css'
import React from 'react'
import PropTypes from 'prop-types'
import {NavigationItem} from '..'

class SubscriptionNavigationItem extends React.Component {

  get isOpen() {
    return this.props.query.feedTagEqual === this.props.item.tag
  }

  get isVisible() {
    return this.isOpen && (this.props.item.subscriptions ? this.props.item.subscriptions.length > 0 : false)
  }

  onSelect(feedTagEqual, feedUuidEqual) {
    this.props.onClick({feedTagEqual, feedUuidEqual})
  }

  isSelected(tag, uuid) {
    return this.props.query.feedUuidEqual === uuid && this.props.query.feedTagEqual === tag
  }

  render() {
    const {
      item,
    } = this.props

    return [
      <NavigationItem selected={this.isSelected(item.tag, item.uuid)}
                      onClick={() => this.onSelect(item.tag, item.uuid)}
                      key={item.uuid}
                      title={item.title}
                      badgeCount={item.unseen} />,
      this.isVisible &&
        <ul key='subscriptions' className='my-subscription-navigation-item__subscriptions'>
          {item.subscriptions.map(subscription => (
            <NavigationItem selected={this.isSelected(subscription.feedTag.name, subscription.uuid)}
                            onClick={() => this.onSelect(subscription.feedTag.name, subscription.uuid)}
                            key={subscription.uuid}
                            title={subscription.title}
                            badgeCount={subscription.unseen} />
            )
          )}
        </ul>
    ]
  }
}

SubscriptionNavigationItem.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string.isRequired,
    unseen: PropTypes.number.isRequired,
    tag: PropTypes.string,
    subscriptions: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        feedTag: PropTypes.shape({
          uuid: PropTypes.string,
          name: PropTypes.string
        }).isRequired
      }).isRequired
    )
  }).isRequired,
  query: PropTypes.PropTypes.shape({
    feedTagEqual: PropTypes.string,
    feedUuidEqual: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default SubscriptionNavigationItem
