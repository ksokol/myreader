import React from 'react'
import PropTypes from 'prop-types'
import {ReactReduxContext} from 'react-redux'
import {routeChange} from '../../store/router'
import {noop} from '../../shared/utils'

export class Link extends React.Component {

  static contextType = ReactReduxContext

  handleClick = event => {
    event.preventDefault()
    this.context.store.dispatch(routeChange(this.props.to))
    this.props.onClick(event)
  }

  render() {
    const { to, onClick, children, ...rest} = this.props

    return (
      <a
        href={`#${to.url}`}
        onClick={this.handleClick}
        {...rest}
      >
        {children}
      </a>
    )
  }
}

Link.defaultProps = {
  onClick: noop
}

Link.propTypes = {
  to: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.any
}
