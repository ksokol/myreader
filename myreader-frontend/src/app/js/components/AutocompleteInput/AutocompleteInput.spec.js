import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {AutocompleteInput} from './AutocompleteInput'

describe('AutocompleteInput', () => {

  let props

  beforeEach(() => {
    props = {
      id: 'expected-id',
      name: 'expected-name',
      value: 'expected value',
      placeholder: 'expected placeholder',
      values: ['tag1', 'tag2', 'other'],
      autoComplete: 'on',
      onSelect: jest.fn()
    }
  })

  it('should pass expected props to input component', () => {
    props.disabled = true
    render(<AutocompleteInput {...props} />)

    expect(screen.getByPlaceholderText('expected placeholder')).toHaveAttribute('id', 'expected-id')
    expect(screen.getByPlaceholderText('expected placeholder')).toHaveAttribute('name', 'expected-name')
    expect(screen.getByPlaceholderText('expected placeholder')).toHaveValue('expected value')
    expect(screen.getByPlaceholderText('expected placeholder')).toBeDisabled()
    expect(screen.getByPlaceholderText('expected placeholder')).toBeInTheDocument()
  })

  it('should trigger prop function "onSelect" when input value changed', () => {
    render(<AutocompleteInput {...props} />)

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: 't'}})
    expect(props.onSelect).toHaveBeenCalledWith('t')

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: 'ta'}})
    expect(props.onSelect).toHaveBeenCalledWith('ta')

    fireEvent.change(screen.getByPlaceholderText('expected placeholder'), {target: {value: ''}})
    expect(props.onSelect).toHaveBeenCalledWith(null)
  })

  it('should connect datalist to input', () => {
    const {container} = render(<AutocompleteInput {...props} />)
    const datalistId = container.querySelector('datalist').id

    expect(datalistId).toMatch(/^my-autocomplete-input__datalist-\d+$/)
    expect(screen.getByPlaceholderText('expected placeholder')).toHaveAttribute('list', datalistId)
  })

  it('should render prop "values" as datalist options', () => {
    const {container} = render(<AutocompleteInput {...props} />)

    const optionValues = []
    for (const child of container.querySelector('datalist').children) {
      optionValues.push(child.value)
    }

    expect(optionValues).toEqual(['tag1', 'tag2', 'other'])
  })
})
