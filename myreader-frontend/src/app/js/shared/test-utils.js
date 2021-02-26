/**
 * @deprecated use fetch.rejectResponse(error) instead.
 */
export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

/**
 * @deprecated use fetch.responsePending() instead.
 */
export function pending() {
  return jest.fn().mockReturnValue(new Promise(() => { /* simulate pending */}))
}

/**
 * @deprecated use fetch.jsonResponse(object) instead.
 */
export function resolved(value = {}) {
  return jest.fn().mockResolvedValueOnce(value)
}

/**
 * @deprecated use fetch.rejectResponse(error) instead.
 */
export function rejected(value = {}) {
  return jest.fn().mockRejectedValueOnce(value)
}
