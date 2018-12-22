import './Input.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {noop} from '../../shared/utils'

class Input extends React.Component {

  get id() {
    return this.props.id ? this.props.id : this.props.name
  }

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

  onFocus(event) {
    this.setState({focused: true})
    this.props.onFocus(event)
  }

  onBlur(event) {
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
      ...otherProps
    } = this.props

    return (
      <div className={classNames('my-input', className)}>
        {label &&
        <label htmlFor={this.id}>
          {label}
        </label>
        }

        <input ref={this.myRef}
               {...otherProps}
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
        />

        {renderValidations()}
      </div>
    )
  }
}

Input.propTypes = {
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
