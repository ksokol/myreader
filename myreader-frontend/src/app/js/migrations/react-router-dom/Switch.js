import PropTypes from 'prop-types'

export const Switch = ({children}) => children[0]

Switch.propTypes = {
  children: PropTypes.array.isRequired
}
