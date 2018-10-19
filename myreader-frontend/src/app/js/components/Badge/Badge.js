import './Badge.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {isDefined} from '../../shared/utils'
import {Color} from './Color'

class Badge extends React.Component {

  constructor(props) {
    super(props)

    this.badgeRef = React.createRef()
    this.updateBadgeColor = this.updateBadgeColor.bind(this)
  }

  componentDidMount() {
    this.updateBadgeColor()
  }

  componentDidUpdate(prevProps) {
    if (this.props.color !== prevProps.color) {
      this.updateBadgeColor()
    }
  }

  updateBadgeColor() {
    const rgb = Color.get(this.props.color)
    const badgeRef = this.badgeRef.current

    badgeRef.style.setProperty("--red", rgb.red)
    badgeRef.style.setProperty("--green", rgb.green)
    badgeRef.style.setProperty("--blue", rgb.blue)
  }

  render() {
    const classes = classNames('my-badge', {'my-badge--clickable': isDefined(this.props.onClick)})

    return (
      <div className={classes}
           onClick={this.props.onClick}
           ref={this.badgeRef}>
        <span>{this.props.text}</span>
      </div>
    )
  }
}

Badge.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  onClick: PropTypes.func
}

export default Badge
