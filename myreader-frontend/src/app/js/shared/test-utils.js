/**
 * @deprecated use fetch.rejectResponse(error) instead.
 */
export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}
