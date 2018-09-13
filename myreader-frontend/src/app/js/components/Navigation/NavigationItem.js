import './NavigationItem.css'
import {Badge} from '..'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const NavigationItem = props => {
  const classes = classNames(
    'my-navigation-item',
    {'my-navigation-item--selected': props.selected},
    props.className
  )

  return (
    <li className={classes}
        onClick={props.onClick}>
      <span>{props.title}</span>
      {props.badgeCount && <Badge count={props.badgeCount} />}
    </li>
  )
}

NavigationItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  badgeCount: PropTypes.number,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default NavigationItem
