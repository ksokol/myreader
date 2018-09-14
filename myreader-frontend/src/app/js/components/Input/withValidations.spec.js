import React from 'react'
import withValidations from './withValidations'
import {mount} from 'enzyme'

const ComponentToWrap = () => <p>wrapped component</p>

describe('src/app/js/components/Input/withValidations.spec.js', () => {

  let WrappedComponent, props

  beforeEach(() => {
    props = {
      name: 'expectedName',
      value: 'expectedValue',
      validations: [
        {field: 'expectedName', message: 'expectedMessage1'},
        {field: 'expectedName', message: 'expectedMessage2'}
      ]
    }

    WrappedComponent = withValidations(ComponentToWrap)
  })

  const createMount = () => mount(<WrappedComponent {...props} />)

  it('should pass expected props to wrapped component', () => {
    const {name, value, ...otherProps} = createMount().children().props()

    expect(name).toEqual('expectedName')
    expect(value).toEqual('expectedValue')
    expect(Object.keys(otherProps)).toEqual(['renderValidations', 'className'])
  })

  it('should render wrapped component', () => {
    expect(createMount().find('p').text()).toEqual('wrapped component')
  })

  it('should add error class to wrapped component prop "className" when "validations" prop contains error for prop "name"', () => {
    expect(createMount().children().prop('className')).toEqual('my-input--error')
  })

  it('should not add error class to wrapped component prop "className" when prop "validations" is undefined', () => {
    props.validations = undefined

    expect(createMount().children().prop('className')).toEqual('')
  })

  it('should render multiple validations belonging to the same prop "name"', () => {
    expect(createMount().children().props().renderValidations()).toEqual(
      <div className="my-input__validations">
        <span key="expectedMessage1">expectedMessage1</span>
        <span key="expectedMessage2">expectedMessage2</span>
      </div>
    )
  })

  it('should not render validations when "validations" prop is undefined', () => {
    props.validations = undefined

    expect(createMount().children().props().renderValidations() ).toEqual(<div className="my-input__validations">{[]}</div>)
  })

  it('should render validations belonging to the same prop "name"', () => {
    props.validations = [
      {field: 'expectedName', message: 'expectedMessage1'},
      {field: 'otherName', message: 'expectedMessage2'}
    ]

    expect(createMount().children().props().renderValidations()).toEqual(
      <div className="my-input__validations">
        {[<span key="expectedMessage1">expectedMessage1</span>]}
      </div>
    )
  })

  it('should clear validations when prop "value" changed', () => {
    const wrapper = createMount()
    wrapper.setProps({value: 'otherValue'})

    expect(wrapper.children().props().renderValidations())
      .toEqual(<div className="my-input__validations">{[]}</div>)
  })

  it('should remove error class from wrapped component prop "className" when prop "value" changed', () => {
    const wrapper = createMount()
    wrapper.setProps({value: 'otherValue'})

    expect(wrapper.children().prop('className')).toEqual('')
  })
})
