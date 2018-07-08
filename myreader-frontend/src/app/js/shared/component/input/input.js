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
  }

  onBlur() {
    this.setState({focused: false})
  }

  render() {
    return (
      <div className={classNames('my-input', this.props.className)}>
        {this.props.label && <label htmlFor={this.props.name}>{this.props.label}</label>}

        <input ref={this.myRef}
               id={this.props.name}
               type="text"
               name={this.props.name}
               value={this.props.value}
               placeholder={this.props.placeholder}
               autoComplete="off"
               disabled={this.props.disabled}
               onChange={event => this.props.onChange(event.target.value)}
               onFocus={this.onFocus}
               onBlur={this.onBlur}/>

        {this.props.renderValidations()}
      </div>
    )
  }
}

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  renderValidations: PropTypes.func
}

Input.defaultProps = {
  disabled: false,
  onChange: noop,
  renderValidations: noop
}

export default Input
