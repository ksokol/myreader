import React from 'react'
import PropTypes from 'prop-types'

function retrieveValidationForField({name, validations}) {
  return validations
    .filter(validation => name === validation.field)
    .map(validation => validation.defaultMessage)
    .pop()
}

const withValidations = WrappedComponent => {

  return class WithValidations extends React.Component {

    static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      validations: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string.isRequired,
          defaultMessage: PropTypes.string.isRequired
        })
      )
    }

    static defaultProps = {
      validations: []
    }

    constructor(props) {
      super(props)
      this.state = {
        value: props.value
      }
    }

    static getDerivedStateFromProps(props, state) {
      const validation = props.value === state.value ? retrieveValidationForField(props) : undefined
      return {
        value: props.value,
        validation
      }
    }

    get filteredProps() {
      const {validations, ...inputProps} = this.props
      return inputProps
    }

    renderValidations = () => {
      return (this.state.validation ? (
        <div className="my-input__validations">
          <span key={this.state.validation}>{this.state.validation}</span>
        </div>) : null
      )
    }

    render() {
      const className = this.state.validation ? 'my-input--error' : ''
      const props = Object.assign({renderValidations: this.renderValidations, className}, this.filteredProps)
      return <WrappedComponent {...props} />
    }
  }
}

export default withValidations
