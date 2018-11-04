import React from 'react'
import {shallow} from 'enzyme'
import AutocompleteItemText from './AutocompleteItemText'

describe('AutocompleteItemText', () => {

  const createComponent = props => shallow(<AutocompleteItemText {...props} />)

  it('should show nothing when term and term fragment are undefined', () => {
    expect(createComponent().text()).toEqual('')
  })

  it('should show term without highlighted term fragment when term fragment is undefined', () => {
    expect(createComponent({term: 'expected term'}).html())
      .toEqual('<span style="color:rgb(117, 117, 117)"></span>expected term')
  })

  it('should show term with highlighted term fragment', () => {
    expect(createComponent({term: 'termFragment', termFragment: 'te'}).html())
      .toEqual('<span style="color:rgb(117, 117, 117)">te</span>rmFragment')
  })

  it('should show term without highlighted term fragment when term fragment does not start with term', () => {
    expect(createComponent({term: 'a term', termFragment: 'other'}).text()).toEqual('a term')
  })

  it('should show term without highlighted term fragment when term fragment does not start with uppercase character', () => {
    expect(createComponent({term: 'a term', termFragment: 'A term'}).text()).toEqual('a term')
  })
})
