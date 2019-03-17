import React from 'react'
import PropTypes from 'prop-types'
import formatTimeAgo from './formatTimeAgo'

const TimeAgo = React.memo(({date}) => formatTimeAgo(date))

TimeAgo.propTypes = {
  date: PropTypes.string.isRequired
}

export default TimeAgo
