export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve))
}

export function pending() {
  return jest.fn().mockReturnValue(new Promise(() => {}))
}

export function resolved(value = {}) {
  return jest.fn().mockResolvedValueOnce(value)
}

export function rejected(value = {}) {
  return jest.fn().mockRejectedValueOnce(value)
}
