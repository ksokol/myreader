import React from 'react'
import {mount} from 'enzyme'
import secured from './secured'

describe('secured', () => {

  let Component = () => <p>wrapped component</p>

  const createWrapper = (roles, allowedRole) => {
    const Wrapped = secured(Component, allowedRole)
    const state = {security: {roles}}
    return mount(<Wrapped {...state} />)
  }

  it('should render component when role is equal to default allowed role', () => {
    expect(createWrapper(['USER']).text()).toEqual('wrapped component')
  })

  it('should render component when role is equal to allowed role', () => {
    expect(createWrapper(['USER'], 'USER').text()).toEqual('wrapped component')
  })

  it('should render component when allowed role is included in roles', () => {
    expect(createWrapper(['USER', 'ADMIN'], 'ADMIN').text()).toEqual('wrapped component')
  })

  it('should redirect when role is not equal to allowed role', () => {
    const redirect = createWrapper(['USER'], 'ADMIN').find('Redirect')

    expect(redirect.props()).toEqual({to: {route: ['login'], url: '!/login'}})
  })

  it('should redirect when roles are absent', () => {
    const redirect = createWrapper([], 'USER').find('Redirect')

    expect(redirect.props()).toEqual({to: {route: ['login'], url: '!/login'}})
  })
})
