import React from 'react'

const Link = props => <div {...props} />
const Redirect = () => null

const goBack = jest.fn()
const useHistory = () => ({
  goBack
})

afterEach(() => {
  goBack.mockClear()
})

export {
  Link,
  Redirect,
  useHistory,
}
