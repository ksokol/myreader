import {Badge} from '..'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {isDefined} from '../../shared/utils'
import {Link} from 'react-router-dom'

const NavigationItem = props => {
  const classes = classNames(
    'my-navigation__item',
    {'my-navigation__item--selected': props.selected},
    props.className
  )

  return (
    <li
      className={classes}
    >
      <Link
        to={props.to}
        onClick={props.onClick}
      >
        <span>{props.title}</span>
        {isDefined(props.badgeCount) && <Badge text={props.badgeCount} />}
      </Link>
    </li>
  )
}

NavigationItem.propTypes = {
  className: PropTypes.string,
  to: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  badgeCount: PropTypes.number,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

export default NavigationItem
