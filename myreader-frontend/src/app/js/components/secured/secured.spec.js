import React from 'react'
import {mount} from 'enzyme'
import secured from './secured'
import {LOGIN_URL} from '../../constants'

/* eslint-disable react/prop-types, react/display-name */
jest.mock('../../contexts', () => ({
  withAppContext: Component => Component
}))
/* eslint-enable */

const wrappedComponent = 'wrapped component'

describe('secured', () => {

  let props

  const createWrapper = (roles, allowedRole) => {
    const Wrapped = secured(() => <p>{wrappedComponent}</p>, allowedRole)
    props = {roles}
    return mount(<Wrapped {...props} />)
  }

  it('should render component when allowed role USER is equal to role', () => {
    expect(createWrapper(['USER'], ['USER']).text()).toEqual(wrappedComponent)
  })

  it('should render component when allowed role ADMIN is equal to role', () => {
    expect(createWrapper(['ADMIN'], ['ADMIN']).text()).toEqual(wrappedComponent)
  })

  it('should render component when allowed role ADMIN is included in roles', () => {
    expect(createWrapper(['USER', 'ADMIN'], ['ADMIN']).text()).toEqual(wrappedComponent)
  })

  it('should render component when role USER is included in allowed roles', () => {
    expect(createWrapper(['USER'], ['USER', 'ADMIN']).text()).toEqual(wrappedComponent)
  })

  it('should redirect when when no allowed roles defined', () => {
    const redirect = createWrapper(['USER']).find('Redirect')

    expect(redirect.prop('to')).toEqual(LOGIN_URL)
  })

  it('should redirect when role is not equal to allowed role', () => {
    const redirect = createWrapper(['USER'], ['ADMIN']).find('Redirect')

    expect(redirect.prop('to')).toEqual(LOGIN_URL)
  })

  it('should redirect when roles are absent', () => {
    const redirect = createWrapper([], ['USER']).find('Redirect')

    expect(redirect.prop('to')).toEqual(LOGIN_URL)
  })
})
