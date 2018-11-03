import React from 'react'
import {mount} from 'enzyme'
import Dialog from './Dialog'

describe('Dialog', () => {

  let props

  const mountComponent = () => mount(<Dialog {...props} />)

  beforeAll(() => {
    window.HTMLDialogElement = undefined
  })

  beforeEach(() => {
    props = {
      header: 'expected header',
      body: 'expected body',
      footer: 'expected footer',
      onClickClose: jest.fn()
    }
  })

  it('should render dialog header, body and footer', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('[className="my-dialog__header"]').text()).toEqual('expected header')
    expect(wrapper.find('[className="my-dialog__body"]').text()).toEqual('expected body')
    expect(wrapper.find('[className="my-dialog__footer"]').text()).toEqual('expected footer')
  })

  it('should not render dialog header, body and footer when undefined', () => {
    props = {}

    const wrapper = mountComponent()
    expect(wrapper.find('[className="my-dialog__header"]').exists()).toEqual(false)
    expect(wrapper.find('[className="my-dialog__body"]').exists()).toEqual(false)
    expect(wrapper.find('[className="my-dialog__footer"]').exists()).toEqual(false)
  })

  it('should trigger prop function "onClickClose" when dialog close button clicked', () => {
    const wrapper = mountComponent()
    wrapper.find('[className="my-dialog__close-button"]').simulate('click')

    expect(props.onClickClose).toHaveBeenCalled()
  })

  it('should show dialog when mounted', () => {
    let spy = undefined
    mount(<Dialog dialogRef={el => spy = jest.spyOn(el, 'showModal')} />)

    expect(spy).toHaveBeenCalled()
  })

  it('should close dialog when unmounted', () => {
    let spy = undefined
    const wrapper = mount(<Dialog dialogRef={el => spy = jest.spyOn(el, 'close')} />)
    wrapper.unmount()

    expect(spy).toHaveBeenCalled()
  })
})
