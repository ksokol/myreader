import PropTypes from 'prop-types'
import timeago from 'timeago.js'

const TimeAgo = props => timeago().format(props.date)

TimeAgo.propTypes = {
  date: PropTypes.string.isRequired
}

export default TimeAgo
