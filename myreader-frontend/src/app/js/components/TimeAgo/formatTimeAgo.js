import {isDate, isValidDate} from '../../shared/utils'

const formatter = new Intl.RelativeTimeFormat('en', {style: 'long'})

const DEFAULT_VALUE = 'sometime'
const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60
const ONE_DAY = ONE_HOUR * 24
const ONE_WEEK = ONE_DAY * 7
const FIVE_WEEKS = ONE_WEEK * 5

function formatValue(value, divisor, unit) {
  return formatter.format(Math.floor(value / divisor) * -1, unit)
}

function format(left, right, fn, unit) {
  const leftValue = fn.call(left)
  const rightValue = fn.call(right)
  return rightValue < leftValue
    ? formatter.format(rightValue - leftValue, unit)
    : null
}

export default function formatTimeAgo(value) {
  if (!isValidDate(value)) {
    return DEFAULT_VALUE
  }

  const dateToFormat = (isDate(value) ? value : new Date(value))
  const dateToFormatTimestamp = dateToFormat.getTime()
  const nowTimestamp = Date.now()

  if (nowTimestamp < dateToFormatTimestamp) {
    return DEFAULT_VALUE
  }

  const diff = (nowTimestamp - dateToFormatTimestamp) / 1000

  if (diff < 1) {
    return 'just now'
  }

  if (diff < ONE_MINUTE) {
    return formatValue(diff, 1, 'second')
  }

  if (diff < ONE_HOUR) {
    return formatValue(diff, ONE_MINUTE, 'minute')
  }

  if (diff < ONE_DAY) {
    return formatValue(diff, ONE_HOUR, 'hour')
  }

  if (diff < ONE_WEEK) {
    return formatValue(diff, ONE_DAY, 'day')
  }

  if (diff < FIVE_WEEKS) {
    return formatValue(diff, ONE_WEEK, 'week')
  }

  const nowDate = new Date(nowTimestamp)
  return (
    format(nowDate, dateToFormat, Date.prototype.getUTCFullYear, 'year') ||
    format(nowDate, dateToFormat, Date.prototype.getUTCMonth, 'month')
  )
}
