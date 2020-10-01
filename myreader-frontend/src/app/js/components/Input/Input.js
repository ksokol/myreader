import './Input.css'
import React from 'react'
import PropTypes from 'prop-types'
import {noop} from '../../shared/utils'

const KEY_CODE = 'Enter'

function retrieveValidationForField(name, validations) {
  return validations
    .filter(validation => name === validation.field)
    .map(validation => validation.defaultMessage)
    .pop()
}

export class Input extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    role: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    autoComplete: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEnter: PropTypes.func,
    validations: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string.isRequired,
        defaultMessage: PropTypes.string.isRequired
      })
    )
  }

  static defaultProps = {
    type: 'text',
    role: 'input',
    disabled: false,
    autoComplete: 'off',
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onEnter: noop,
    validations: []
  }

  state = {
    focused: false,
    validations: this.props.validations,
    lastValidations: [],
    value: this.props.value
  }

  inputRef = React.createRef()

  id = () => {
    return this.props.id ? this.props.id : this.props.name
  }

  componentDidUpdate() {
    if (this.state.focused && !this.props.disabled) {
      this.inputRef.current.focus()
    }
  }

  onChange = event => {
    this.setState({
      validations: [],
      lastValidations: this.props.validations
    })
    this.props.onChange(event)
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

  retrieveFieldValidation = () => {
    return this.state.lastValidations !== this.props.validations && this.props.validations.length > 0 ?
      retrieveValidationForField(this.props.name, this.props.validations) : undefined
  }

  render() {
    const {
      className = '',
      label,
      validations,
      onEnter,
      ...otherProps
    } = this.props

    const fieldValidation = this.retrieveFieldValidation()
    const inputClasses = `my-input ${className} ${fieldValidation ? 'my-input--error' : ''}`

    return (
      <div
        className={inputClasses}
      >
        {label && (
          <label
            htmlFor={this.id()}
          >
            {label}
          </label>
        )}

        <input
          {...otherProps}
          ref={this.inputRef}
          id={this.id()}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}
        />

        {fieldValidation ? (
          <div className='my-input__validations' role='validations'>
            <span
              key={fieldValidation}
            >
              {fieldValidation}
            </span>
          </div>) : null
        }
      </div>
    )
  }
}
