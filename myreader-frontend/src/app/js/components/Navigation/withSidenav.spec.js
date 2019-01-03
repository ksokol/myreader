import React from 'react'
import {mount} from 'enzyme'
import {Provider} from 'react-redux'
import withSidenav from './withSidenav'
import {createMockStore} from '../../shared/test-utils'

describe('withSidenav', () => {

  let store

  const givenState = ({mediaBreakpoint = 'phone', sidenavSlideIn = true, backdropVisible = true}) => {
    store.setState({common: {mediaBreakpoint, sidenavSlideIn, backdropVisible}})
  }

  const createComponent = () => {
    const WithSidenav = withSidenav(() => <p>wrapped component</p>)

    const wrapper = mount(
      <Provider store={store}>
        <WithSidenav />
      </Provider>
    )
    return wrapper.find(WithSidenav).children().first()
  }

  beforeEach(() => store = createMockStore())

  it('should slide in navigation on phones and tablets', () => {
    givenState({mediaBreakpoint: 'phone'})
    expect(createComponent().find('.my-sidenav__nav--animate').exists()).toEqual(true)

    givenState({mediaBreakpoint: 'tablet'})
    expect(createComponent().find('.my-sidenav__nav--animate').exists()).toEqual(true)

    givenState({mediaBreakpoint: 'desktop'})
    expect(createComponent().find('.my-sidenav__nav--animate').exists()).toEqual(false)
  })

  it('should toggle navigation when state changes', () => {
    givenState({sidenavSlideIn: true})
    expect(createComponent().find('.my-sidenav__nav--open').exists()).toEqual(true)

    givenState({sidenavSlideIn: false})
    expect(createComponent().find('.my-sidenav__nav--open').exists()).toEqual(false)
  })

  it('should show hamburger menu on phones and tablets', () => {
    givenState({mediaBreakpoint: 'phone'})
    expect(createComponent().find('Icon[type="bars"]').exists()).toEqual(true)

    givenState({mediaBreakpoint: 'tablet'})
    expect(createComponent().find('Icon[type="bars"]').exists()).toEqual(true)

    givenState({mediaBreakpoint: 'desktop'})
    expect(createComponent().find('Icon[type="bars"]').exists()).toEqual(false)
  })

  it('should toggle navigation when hamburger menu icon clicked', () => {
    createComponent().find('Icon[type="bars"]').simulate('click')

    expect(store.getActionTypes()).toEqual(['TOGGLE_SIDENAV'])
  })

  it('should render wrapped component', () => {
    expect(createComponent().find('p').text()).toEqual('wrapped component')
  })
})
