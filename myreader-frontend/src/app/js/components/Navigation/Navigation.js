import './Navigation.css'
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import createSubscriptionNavigation from './SubscriptionNavigation/createSubscriptionNavigation'
import NavigationItem from './NavigationItem'
import SubscriptionNavigationItem from './SubscriptionNavigation/SubscriptionNavigationItem'
import {
  ADMIN_FEEDS_URL,
  ADMIN_OVERVIEW_URL,
  BOOKMARK_URL,
  LOGOUT_URL,
  SETTINGS_URL,
  SUBSCRIPTION_ADD_URL,
  SUBSCRIPTIONS_URL
} from '../../constants'
import {authorizedSelector, subscriptionsSelector} from '../../store'
import {useAppContext} from '../../contexts'

const mapStateToProps = state => ({
  ...authorizedSelector(state),
  ...subscriptionsSelector(state)
})

const Navigation = props => {
  const {
    subscriptions,
    isAdmin,
    onClick
  } = props

  const {
    showUnseenEntries
  } = useAppContext()

  const filteredSubscriptions = subscriptions.filter(it => showUnseenEntries ? it.unseen > 0 : true)

  return (
    <ul className='my-navigation'>
      {
        [
          ...createSubscriptionNavigation(filteredSubscriptions).map(item =>
            <SubscriptionNavigationItem
              key={item.key}
              item={item}
              onClick={onClick}
            />
          ),
          <NavigationItem
            key='subscriptions'
            title='Subscriptions'
            to={SUBSCRIPTIONS_URL}
            onClick={onClick}
          />,
          <NavigationItem
            key='bookmarks'
            title='Bookmarks'
            to={BOOKMARK_URL}
            onClick={onClick}
          />,
          <NavigationItem
            key='settings'
            title='Settings'
            to={SETTINGS_URL}
            onClick={onClick}
          />,
          isAdmin ? [
            <NavigationItem
              key='admin'
              title='Admin'
              to={ADMIN_OVERVIEW_URL}
              onClick={onClick}
            />,
            <NavigationItem
              key='feeds'
              title='Feeds'
              to={ADMIN_FEEDS_URL}
              onClick={onClick}
            />
          ] : null,
          <NavigationItem
            key='add subscription'
            className='my-navigation__item--blue'
            title='Add subscription'
            to={SUBSCRIPTION_ADD_URL}
            onClick={onClick}
          />
        ]
      }
      <NavigationItem
        key='logout'
        className='my-navigation__item--red'
        title='Logout'
        to={LOGOUT_URL}
        onClick={onClick}
      />
    </ul>
  )
}

Navigation.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.any),
  isAdmin: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

Navigation.defaultProps = {
  subscriptions: []
}

export default connect(
  mapStateToProps
)(Navigation)
