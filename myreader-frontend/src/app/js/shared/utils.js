const isDefined = value => typeof value !== 'undefined'

const isString = value => value !== null && typeof value === 'string'

export const isBoolean = value => typeof value === 'boolean'

const isDate = value => value instanceof Date

export const isValidDate = value => {
  if (!isString(value) && !isDate(value)) {
    return false
  }

  return !Number.isNaN(
    isDate(value)
      ? value.getTime()
      : new Date(value).getTime()
  )
}

function isNotNull(value) {
  return value !== null
}

export function isValuePresent(value) {
  return isNotNull(value) && isDefined(value)
}
