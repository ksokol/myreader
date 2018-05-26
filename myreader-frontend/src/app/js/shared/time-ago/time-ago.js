import PropTypes from 'prop-types'
import timeago from 'timeago.js'

export const TimeAgo = props => timeago().format(props.date)

TimeAgo.propTypes = {
    date: PropTypes.string.isRequired
}
