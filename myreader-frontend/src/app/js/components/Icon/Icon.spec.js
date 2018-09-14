import React from 'react'
import Icon from './Icon'
import {shallow} from 'enzyme'

describe('src/app/js/components/Icon/Icon.spec.js', () => {

  it('should render close icon with default color', () => {
    expect(shallow(<Icon type="close"/>).hasClass('my-icon my-icon__close my-icon--grey')).toEqual(true)
  })

  it('should render close icon with white color', () => {
    expect(shallow(<Icon type="close" color="white"/>).hasClass('my-icon my-icon__close my-icon--white')).toEqual(true)
  })

  it('should render some other icon', () => {
    expect(shallow(<Icon type="some" />).hasClass('my-icon__some')).toEqual(true)
  })

  it('should disabled icon', () => {
    expect(shallow(<Icon type="close" disabled={true}/>).hasClass('my-icon my-icon__close my-icon--grey my-icon--disabled')).toEqual(true)
  })
})
