import React from 'react'
import formatTimeAgo from './formatTimeAgo'

const TimeAgo = React.memo(({date}) => formatTimeAgo(date))

export default TimeAgo
