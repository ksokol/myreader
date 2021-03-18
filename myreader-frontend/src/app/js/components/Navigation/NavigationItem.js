import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Badge} from '../Badge/Badge'

export function NavigationItem({
  className = '',
  title,
  selected,
  to,
  badgeCount,
  onClick,
}) {
  return (
    <li
      className={`my-navigation__item ${className}`}
      role={selected ? 'selected-navigation-item' : 'navigation-item'}
    >
      <Link
        to={to}
        onClick={event => onClick && onClick(event)}
      >
        <span>{title}</span>
        {badgeCount >= 0 && <Badge text={badgeCount} />}
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
  onClick: PropTypes.func
}
