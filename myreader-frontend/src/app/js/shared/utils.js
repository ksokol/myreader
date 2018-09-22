import isEqual from 'lodash.isequal'

const isFunction = value => typeof value === 'function'

export const isDefined = value => typeof value !== 'undefined'

export const isString = value => value !== null && typeof value === 'string'

export const isObject = value => value !== null && typeof value === 'object'

export const isPromiseLike = value => !!(isObject(value) && isFunction(value.then) && isFunction(value.catch))

export const isBoolean = value => typeof value === 'boolean'

export const isDate = value => value instanceof Date

export const toArray = value => value ? Array.isArray(value) ? value : [value] : []

export const arrayIncludes = (left, right) =>
  Array.isArray(left) && Array.isArray(right) &&
  left.every((leftValue, leftIndex) => leftValue === right[leftIndex])

export const objectEquals = (left, right) => isEqual(left, right)

export const noop = () => {}
