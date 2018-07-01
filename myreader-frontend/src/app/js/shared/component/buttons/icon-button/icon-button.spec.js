import React from 'react'
import {shallowOutput} from '../../../test-utils'
import IconButton from './icon-button'
import TestRenderer from 'react-test-renderer'

describe('src/app/js/shared/component/buttons/icon-button/icon-button.spec.js', () => {

  it('should add prop "className" to IconButton component', () => {
    const instance = shallowOutput(<IconButton className="expected-className" type="close" color="white"/>)

    expect(instance.props.className).toEqual('my-icon-button expected-className')
  })

  it('should pass expected props to Icon component', () => {
    const instance = shallowOutput(<IconButton type="close" color="white"/>)

    expect(instance.props.children.props).toEqual({type: 'close', color: 'white'})
  })

  it('should trigger prop "onClick" function when clicked', () => {
    const onClick = jest.fn()
    const instance = TestRenderer.create(<IconButton type="close" onClick={onClick}/>).root
    instance.findByProps({onClick}).props.onClick()

    expect(onClick).toHaveBeenCalled()
  })
})
