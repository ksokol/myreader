import {isValidDate} from '../../shared/utils'

/*
 * based on https://github.com/hustcc/timeago.js/tree/7ebf670ec3d47af66b175225eb675354d12951c2
 */

const timeUnits = [
  60, // 60 seconds in 1 min
  60, // 60 mins in 1 hour
  24, // 24 hours in 1 day
  7, // 7 days in 1 week
  365 / 7 / 12, // 4.345238095238096 weeks in 1 month
  12, // 12 months in 1 year
]

const labels = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']

function format(seconds, unitOfTime, inThePast) {
  let unit = labels[Math.floor(unitOfTime / 2)]
  seconds = unitOfTime === 0 ? 1 : seconds
  unit += seconds > 1 ? 's' : ''

  return inThePast ? `${seconds} ${unit} ago` : `in ${seconds} ${unit}`
}

function formatSeconds(seconds, inThePast) {
  let unitOfTime = 0

  for (; seconds >= timeUnits[unitOfTime] && unitOfTime < timeUnits.length; unitOfTime++) {
    seconds /= timeUnits[unitOfTime]
  }

  seconds = Math.floor(seconds)
  unitOfTime *= 2

  if (seconds > (unitOfTime === 0 ? 9 : 1)) {
    unitOfTime += 1
  }

  return format(seconds, unitOfTime, inThePast)
}

function differenceInSeconds(date) {
  const nowInMilliseconds = Date.now()
  return (nowInMilliseconds - new Date(date).getTime()) / 1000
}

export function formatTimeAgo(date) {
  if (!isValidDate(date)) {
    return 'sometime'
  }
  const seconds = differenceInSeconds(date)
  return formatSeconds(Math.abs(seconds), seconds >= 0)
}
