import React from 'react'
import {mount} from 'enzyme'
import {Secured} from './Secured'
import {LOGIN_PAGE_PATH} from '../../constants'
import {useSecurity} from '../../contexts/security'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../contexts/security', () => ({
  useSecurity: jest.fn().mockReturnValue({
    roles: []
  })
}))
/* eslint-enable */

const wrappedComponent = 'wrapped component'

describe('Secured', () => {

  const createWrapper = (authorized) => {
    useSecurity.mockReturnValueOnce({authorized})
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const Wrapped = () => Secured(() => <p>{wrappedComponent}</p>)
    return mount(<Wrapped />)
  }

  it('should render component if authorized', () => {
    expect(createWrapper(true).text()).toEqual(wrappedComponent)
  })

  it('should redirect if unauthorized', () => {
    const redirect = createWrapper(false).find('Redirect')

    expect(redirect.prop('to')).toEqual(LOGIN_PAGE_PATH)
  })
})
