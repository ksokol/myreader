import PropTypes from 'prop-types'
import {Badge} from '../Badge/Badge'
import {Link} from '../router'

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
  to: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  badgeCount: PropTypes.number,
  selected: PropTypes.bool,
  onClick: PropTypes.func
}
