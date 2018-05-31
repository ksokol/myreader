import React from 'react'
import {renderer, shallow} from '../../../test-utils'
import {IconButton} from './icon-button'

describe('src/app/js/shared/component/buttons/icon-button/icon-button.spec.js', () => {

    it('should render icon button with close icon and white color', () => {
        expect(shallow(<IconButton type="close" color="white" />)).toMatchSnapshot()
    })

    it('should trigger onClick function when clicked', () => {
        const onClick = jest.fn()
        const instance = renderer(<IconButton type="close" onClick={onClick} />)
        instance.findByProps({onClick}).props.onClick()

        expect(onClick).toHaveBeenCalled()
    })
})
