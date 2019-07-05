import './Input.css'
import React from 'react'
import PropTypes from 'prop-types'
import {noop} from '../../shared/utils'

const KEY_CODE = 'Enter'

export class Input extends React.Component {

  static propTypes = {
    id: PropTypes.string,
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
    onEnter: PropTypes.func,
    renderValidations: PropTypes.func
  }

  static defaultProps = {
    type: 'text',
    disabled: false,
    autoComplete: 'off',
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onEnter: noop,
    renderValidations: noop
  }

  state = {
    focused: false
  }

  inputRef = React.createRef()

  get id() {
    return this.props.id ? this.props.id : this.props.name
  }

  componentDidUpdate() {
    if (this.state.focused && !this.props.disabled) {
      this.inputRef.current.focus()
    }
  }

  onKeyUp = event => {
    if (event.key === KEY_CODE) {
      this.props.onEnter(event)
    }
  }

  onFocus = event => {
    this.setState({focused: true})
    this.props.onFocus(event)
  }

  onBlur = event =>  {
    this.setState({focused: false})
    this.props.onBlur(event)
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
      renderValidations,
      onEnter,
      ...otherProps
    } = this.props

    return (
      <div
        className={`my-input ${className || ''}`}
      >
        {label && (
          <label
            htmlFor={this.id}
          >
            {label}
          </label>
        )}

        <input
          {...otherProps}
          ref={this.inputRef}
          id={this.id}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}
        />

        {renderValidations()}
      </div>
    )
  }
}
