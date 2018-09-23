import './NavigationItem.css'
import {Badge} from '..'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {isDefined} from '../../shared/utils'

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
      {isDefined(props.badgeCount) && <Badge text={props.badgeCount} />}
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
