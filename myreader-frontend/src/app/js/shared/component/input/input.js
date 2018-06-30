import './input.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Input = props => {
    return (
        <div className={classNames('my-input', props.className)}>
            {props.label && <label htmlFor={props.name}>{props.label}</label>}

            <input id={props.name}
                   type="text"
                   name={props.name}
                   value={props.value}
                   autoComplete="off"
                   disabled={props.disabled}
                   onChange={event => props.onChange(event.target.value)} />

            {props.renderValidations()}
        </div>
    )
}

Input.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    renderValidations: PropTypes.func
}

Input.defaultProps = {
    className: '',
    disabled: false,
    onChange: () => {},
    renderValidations: () => {}
}

export default Input
