import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'

const withDebounce = (WrappedInput, timeout = 0) => {

  const WithDebounce = class WithDebounce extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        value: props.value,
        previousPropValue: props.value
      }

      const debounceOnChange = debounce(this.props.onChange, timeout)

      const onChangeDebounced = event => {
        this.setState({value: event.target.value})
        event.persist()
        debounceOnChange(event)
      }

      this.onChange = timeout > 0 ? onChangeDebounced : this.props.onChange
    }

    static getDerivedStateFromProps(props, state) {
      return {
        value: state.previousPropValue !== props.value ? props.value : state.value,
        previousPropValue: props.value,
      }
    }

    render() {
      const props = {
        ...this.props,
        onChange: this.onChange,
        value: this.state.value
      }

      return <WrappedInput {...props} />
    }
  }

  WithDebounce.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  WithDebounce.defaultTypes = {
    value: ''
  }

  return WithDebounce
}

export default withDebounce
