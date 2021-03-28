import './Input.css'
import React, {useEffect, useState, useRef} from 'react'
import PropTypes from 'prop-types'

const KEY_CODE = 'Enter'

function retrieveValidationForField(name, validations) {
  return validations
    .filter(validation => name === validation.field)
    .map(validation => validation.defaultMessage)
    .pop()
}

export function Input({
  className = '',
  label,
  validations = [],
  onEnter,
  ...props
}) {
  const [state, setState] = useState({
    focused: false,
    validations: validations,
    lastValidations: [],
    value: props.value
  })
  const inputRef = useRef()

  const id = () => {
    return props.id ? props.id : props.name
  }

  useEffect(() => {
    if (state.focused && !props.disabled) {
      inputRef.current.focus()
    }
  }, [props.disabled, state.focused])

  const onChange = event => {
    setState({
      validations: [],
      lastValidations: validations
    })
    props.onChange && props.onChange(event)
  }

  const onKeyUp = event => {
    if (event.key === KEY_CODE) {
      onEnter(event)
    }
  }

  const onFocus = event => {
    setState({focused: true})
    props.onFocus && props.onFocus(event)
  }

  const onBlur = event =>  {
    setState({focused: false})
    props.onBlur && props.onBlur(event)
  }

  const retrieveFieldValidation = () => {
    return state.lastValidations !== validations && validations.length > 0
      ? retrieveValidationForField(props.name, validations)
      : undefined
  }

  const fieldValidation = retrieveFieldValidation()
  const inputClasses = `my-input ${className} ${fieldValidation ? 'my-input--error' : ''}`

  return (
    <div
      className={inputClasses}
    >
      {label && (
        <label
          htmlFor={id()}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        ref={inputRef}
        id={id()}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
      />

      {fieldValidation ? (
        <div
          className='my-input__validations'
          role={`${id()}-validation`}
        >
          <span
            key={fieldValidation}
          >
            {fieldValidation}
          </span>
        </div>
      ) : null}
    </div>
  )
}

Input.propTypes = {
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

Input.defaultProps = {
  type: 'text',
  role: 'input',
  disabled: false,
  autoComplete: 'off',
}
