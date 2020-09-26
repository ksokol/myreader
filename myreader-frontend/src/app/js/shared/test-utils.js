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

export const entry1 = Object.freeze({
  uuid: '1',
  title: 'title1',
  feedTitle: 'expected feedTitle1',
  tags: ['expected tag1'],
  origin: 'expected origin1',
  seen: false,
  createdAt: 'expected createdAt',
  content: 'expected content1',
})

export const entry2 = Object.freeze({
  uuid: '2',
  title: 'title2',
  feedTitle: 'expected feedTitle2',
  tags: ['expected tag2'],
  origin: 'expected origin2',
  seen: false,
  createdAt: 'expected createdAt2',
  content: 'expected content2',
})

export const entry3 = Object.freeze({
  uuid: '3',
  title: 'title3',
  feedTitle: 'expected feedTitle3',
  tags: ['expected tag3'],
  origin: 'expected origin3',
  seen: false,
  createdAt: 'expected createdAt3',
  content: 'expected content3',
})

export const entry4 = Object.freeze({
  uuid: '4',
  title: 'title4',
  feedTitle: 'expected feedTitle4',
  tags: ['expected tag4'],
  origin: 'expected origin4',
  seen: false,
  createdAt: 'expected createdAt4',
  content: 'expected content4',
})
