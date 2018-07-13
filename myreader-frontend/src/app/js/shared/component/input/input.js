import './input.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {noop} from '../../../shared/utils'

class Input extends Component {

  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }
    this.myRef = React.createRef()

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  componentDidUpdate() {
    if (this.state.focused && !this.props.disabled) {
      this.myRef.current.focus()
    }
  }

  onFocus() {
    this.setState({focused: true})
    this.props.onFocus()
  }

  onBlur() {
    this.setState({focused: false})
    this.props.onBlur()
  }

  render() {
    const {
      type,
      className,
      label,
      name,
      value,
      placeholder,
      autoComplete,
      disabled,
      onChange,
      renderValidations
    } = this.props

    return (
      <div className={classNames('my-input', className)}>
        {label && <label htmlFor={name}>{label}</label>}

        <input ref={this.myRef}
               id={name}
               type={type}
               name={name}
               value={value}
               placeholder={placeholder}
               autoComplete={autoComplete}
               disabled={disabled}
               onChange={event => onChange(event.target.value)}
               onFocus={this.onFocus}
               onBlur={this.onBlur}/>

        {renderValidations()}
      </div>
    )
  }
}

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  renderValidations: PropTypes.func
}

Input.defaultProps = {
  type: 'text',
  disabled: false,
  autoComplete: 'off',
  onChange: noop,
  onFocus: noop,
  onBlur: noop,
  renderValidations: noop
}

export default Input
