export const isDefined = value => typeof value !== 'undefined'

export const isString = value => value !== null && typeof value === 'string'

export const isObject = value => value !== null && typeof value === 'object'

export const isBoolean = value => typeof value === 'boolean'

export const isDate = value => value instanceof Date

export const toArray = value => {
  if (value) {
    return Array.isArray(value) ? value : [value]
  }
  return []
}

export const noop = () => {}

export const isValidDate = value => {
  if (!isString(value) && !isDate(value)) {
    return false
  }

  return !isNaN(
    isDate(value)
      ? value.getTime()
      : new Date(value).getTime()
  )
}

export function isNotNull(value) {
  return value !== null
}

export function isValuePresent(value) {
  return isNotNull(value) && isDefined(value)
}
