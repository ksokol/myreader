import React, {Component} from 'react'
import PropTypes from 'prop-types'

function retrieveValidationsForField({name, validations}) {
    return validations
        .filter(validation => name === validation.field)
        .map(validation => validation.message)
}

const withValidations = WrappedComponent => {

    const WithValidations = class WithValidations extends Component {

        constructor(props) {
            super(props)
            this.state = {
                value: props.value
            }

            this.renderValidations = this.renderValidations.bind(this)
        }

        static getDerivedStateFromProps(props, state) {
            const validations = props.value === state.value ? retrieveValidationsForField(props) : []
            return {
                value: props.value,
                validations
            }
        }

        get filteredProps() {
            const {validations, ...inputProps} = this.props
            return inputProps
        }

        renderValidations() {
            return (
                <div className="my-input__validations">
                    {this.state.validations.map(message => <span key={message}>{message}</span>)}
                </div>
            )
        }

        render() {
            const className = this.state.validations.length > 0 ? 'my-input--error' : '';
            const props = Object.assign({renderValidations: this.renderValidations, className}, this.filteredProps)
            return <WrappedComponent {...props} />
        }
    }

    WithValidations.propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
        validations: PropTypes.arrayOf(
            PropTypes.shape({
                field: PropTypes.string.isRequired,
                message: PropTypes.string.isRequired
            })
        )
    }

    WithValidations.defaultProps = {
        validations: []
    }

    return WithValidations
}

export default withValidations
