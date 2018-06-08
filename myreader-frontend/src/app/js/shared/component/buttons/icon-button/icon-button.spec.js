import React from 'react'
import {shallow} from '../../../test-utils'
import {IconButton} from './icon-button'
import TestRenderer from 'react-test-renderer'

describe('src/app/js/shared/component/buttons/icon-button/icon-button.spec.js', () => {

    it('should render icon button with close icon and white color', () => {
        expect(shallow(<IconButton type="close" color="white" />)).toMatchSnapshot()
    })

    it('should trigger onClick function when clicked', () => {
        const onClick = jest.fn()
        const instance = TestRenderer.create(<IconButton type="close" onClick={onClick} />).root
        instance.findByProps({onClick}).props.onClick()

        expect(onClick).toHaveBeenCalled()
    })
})
