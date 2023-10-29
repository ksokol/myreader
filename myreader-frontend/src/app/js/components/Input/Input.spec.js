import React, {useState} from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {Input} from './Input'

function TestComponent({
  withOnChange = true,
  withOnFocus = true,
  withOnBlur = true,
  withOnEnter = true,
  ...inputProps
}) {
  const [onChangeValue, setOnChangeValue] = useState('')
  const [onFocus, setOnFocus] = useState('no focus')
  const [onBlur, setOnBlur] = useState('no blur')
  const [onEnter, setOnEnter] = useState('no enter')

  return (
    <>
      <span role='on-change'>{onChangeValue}</span>
      <span role='on-focus'>{onFocus}</span>
      <span role='on-blur'>{onBlur}</span>
      <span role='on-enter'>{onEnter}</span>
      <Input
        {...inputProps}
        onChange={event => withOnChange && setOnChangeValue(event.target.value)}
        onFocus={() => withOnFocus && setOnFocus('focused')}
        onBlur={() => withOnBlur && setOnBlur('blurred')}
        onEnter={() => withOnEnter && setOnEnter('enter pressed')}
      />
    </>
  )
}

const expectedPlaceholder = 'expected placeholder'
const inputErrorClass = 'my-input--error'
const expectedIdValidation = 'expectedId-validation'

describe('Input', () => {

  let props

  beforeEach(() => {
    props = {
      id: 'expectedId',
      type: 'text',
      label: 'expectedLabel',
      name: 'expectedName',
      role: 'expectedRole',
      value: 'expectedValue',
      placeholder: expectedPlaceholder,
      autoComplete: 'expectedAutocomplete',
      disabled: false,
      validations: [
        {field: 'expectedName', defaultMessage: 'expectedMessage1'},
        {field: 'expectedName', defaultMessage: 'expectedMessage2'}
      ],
    }
  })

  it('should render label when prop "label" is defined', () => {
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).toBeInTheDocument()
    expect(screen.getByDisplayValue('expectedValue')).toBeInTheDocument()
  })

  it('should not render label when prop "label" is undefined', () => {
    delete props.label
    render(<Input {...props} />)

    expect(screen.queryByLabelText('expectedLabel')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('expectedValue')).toBeInTheDocument()
  })

  it('should pass expected props to label when prop "id" is undefined', () => {
    props.id = undefined
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).toBeInTheDocument()
  })

  it('should disable input when prop "disabled" is true', () => {
    props.disabled = true
    render(<Input {...props} />)

    expect(screen.getByDisplayValue('expectedValue')).toBeDisabled()
  })

  it('should not disable input when prop "disabled" is false', () => {
    props.disabled = false
    render(<Input {...props} />)

    expect(screen.getByDisplayValue('expectedValue')).toBeEnabled()
  })

  it('should trigger prop "onChange" function', () => {
    render(<TestComponent {...props} />)
    fireEvent.change(screen.getByPlaceholderText(expectedPlaceholder), {target: {value: 'new value'}})

    expect(screen.getByRole('on-change')).toHaveTextContent('new value')
  })

  it('should not throw error when prop "onChange" function is undefined', () => {
    render(<TestComponent {...props} withOnChange={false} />)

    expect(screen.getByRole('on-change')).toHaveTextContent('')
  })

  it('should merge prop "className"', () => {
    props.className = 'expected-class'
    const {container} = render(<Input {...props} />)

    expect(container.firstChild).toHaveClass('expected-class')
  })

  it('should not focus input field after mount', () => {
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).not.toHaveFocus()
  })

  it('should focus input field', () => {
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).not.toHaveFocus()
    fireEvent.focus(screen.getByLabelText('expectedLabel'))

    expect(screen.getByLabelText('expectedLabel')).toHaveFocus()
  })

  it('should restore focus when prop "disabled" changed back to true and input field was focused before', () => {
    props.disabled = true
    const {rerender} = render(<Input {...props} />)

    fireEvent.focus(screen.getByLabelText('expectedLabel'))
    expect(screen.getByLabelText('expectedLabel')).not.toHaveFocus()

    props.disabled = false
    rerender(<Input {...props} />)

    fireEvent.focus(screen.getByLabelText('expectedLabel'))
    expect(screen.getByLabelText('expectedLabel')).toHaveFocus()
  })

  it('should set input type to "number"', () => {
    props.type = 'number'
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).toHaveAttribute('type', 'number')
  })

  it('should set input autocomplete value to "some-autocomplete"', () => {
    props.autoComplete = 'some-autocomplete'
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).toHaveAttribute('autoComplete', 'some-autocomplete')
  })

  it('should set additional input props', () => {
    props['aria-label'] = 'some aria label'
    render(<Input {...props} />)

    expect(screen.getByLabelText('expectedLabel')).toHaveAttribute('aria-label', 'some aria label')
  })

  it('should trigger prop "onFocus" function when input focused', () => {
    render(<TestComponent {...props} />)
    fireEvent.focus(screen.getByLabelText('expectedLabel'))

    expect(screen.getByRole('on-focus')).toHaveTextContent('focused')
  })

  it('should not throw an error when prop "onFocus" function is undefined', () => {
    render(<TestComponent {...props} withOnFocus={false} />)
    fireEvent.focus(screen.getByLabelText('expectedLabel'))

    expect(screen.getByRole('on-focus')).toHaveTextContent('no focus')
  })

  it('should trigger prop "onBlur" function when input leaved', () => {
    render(<TestComponent {...props} />)
    fireEvent.blur(screen.getByLabelText('expectedLabel'))

    expect(screen.getByRole('on-blur')).toHaveTextContent('blurred')
  })

  it('should not throw an error when prop "onBlur" function is undefined', () => {
    render(<TestComponent {...props} withOnBlur={false} />)
    fireEvent.blur(screen.getByLabelText('expectedLabel'))

    expect(screen.getByRole('on-blur')).toHaveTextContent('no blur')
  })

  it('should trigger prop function "onEnter" when enter key pressed', () => {
    render(<TestComponent {...props} />)
    fireEvent.keyUp(screen.getByLabelText('expectedLabel'), {key: 'Enter', keyCode: 13})

    expect(screen.getByRole('on-enter')).toHaveTextContent('enter pressed')
  })

  it('should not throw an exception when enter key pressed and prop function "onEnter" is undefined', () => {
    render(<TestComponent {...props} withOnEnter={false} />)
    fireEvent.keyUp(screen.getByLabelText('expectedLabel'), {key: 'Enter', keyCode: 13})

    expect(screen.getByRole('on-enter')).toHaveTextContent('no enter')
  })

  it('should not trigger prop function "onEnter" when esc key pressed', () => {
    render(<TestComponent {...props} />)
    fireEvent.keyUp(screen.getByLabelText('expectedLabel'), {key: 'Escape', keyCode: 27})

    expect(screen.getByRole('on-enter')).toHaveTextContent('no enter')
  })

  it('should add error class when prop "validations" contains error for prop "name"', () => {
    const {container} = render(<Input {...props} />)

    expect(container.firstChild).toHaveClass(inputErrorClass)
  })

  it('should not add error class when prop "validations" is undefined', () => {
    props.validations = undefined
    const {container} = render(<Input {...props} />)

    expect(container.firstChild).not.toHaveClass(inputErrorClass)
  })

  it('should render last validation for prop "name"', () => {
    render(<Input {...props} />)

    expect(screen.getByRole(expectedIdValidation)).not.toHaveTextContent('expectedMessage1')
    expect(screen.getByRole(expectedIdValidation)).toHaveTextContent('expectedMessage2')
  })

  it('should not render last validation when prop "validations" is undefined', () => {
    props.validations = undefined
    render(<Input {...props} />)

    expect(screen.queryByRole(expectedIdValidation)).not.toBeInTheDocument()
  })

  it('should render last validation belonging to the same prop "name"', () => {
    props.validations = [
      {field: 'expectedName', defaultMessage: 'expectedMessage1'},
      {field: 'otherName', defaultMessage: 'expectedMessage2'}
    ]
    render(<Input {...props} />)

    expect(screen.getByRole(expectedIdValidation)).toHaveTextContent('expectedMessage1')
    expect(screen.getByRole(expectedIdValidation)).not.toHaveTextContent('expectedMessage2')
  })

  it('should clear validations when input changed', () => {
    render(<Input {...props} />)
    fireEvent.change(screen.getByPlaceholderText(expectedPlaceholder), {target: {value: 't'}})

    expect(screen.queryByRole(expectedIdValidation)).not.toBeInTheDocument()
  })

  it('should remove error class when input changed', () => {
    const {container} = render(<Input {...props} />)
    fireEvent.change(screen.getByPlaceholderText(expectedPlaceholder), {target: {value: 't'}})

    expect(container.firstChild).not.toHaveClass(inputErrorClass)
  })

  it('should render last validation when prop "validations" changed although the values stays the same', () => {
    const {rerender} = render(<Input {...props} />)
    fireEvent.change(screen.getByPlaceholderText(expectedPlaceholder), {target: {value: 't'}})
    rerender(<Input {...props} validations={[...props.validations]} />)

    expect(screen.getByRole(expectedIdValidation)).not.toHaveTextContent('expectedMessage1')
    expect(screen.getByRole(expectedIdValidation)).toHaveTextContent('expectedMessage2')
  })
})
