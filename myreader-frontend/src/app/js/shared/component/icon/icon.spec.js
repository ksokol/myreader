import React from 'react'
import {shallowOutput} from '../../test-utils'
import {Icon} from './icon'

describe('src/app/js/shared/component/icon/icon.spec.js', () => {

  it('should render close icon with default color', () => {
    expect(shallowOutput(<Icon type="close"/>))
      .toEqual(<span className="my-icon my-icon__close my-icon--grey"/>)
  })

  it('should render close icon with white color', () => {
    expect(shallowOutput(<Icon type="close" color="white"/>))
      .toEqual(<span className="my-icon my-icon__close my-icon--white"/>)
  })

  it('should disabled icon', () => {
    expect(shallowOutput(<Icon type="close" disabled={true}/>))
      .toEqual(<span className="my-icon my-icon__close my-icon--grey my-icon--disabled"/>)
  })
})
