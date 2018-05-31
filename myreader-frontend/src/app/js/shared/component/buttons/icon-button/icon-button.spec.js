import React from 'react'
import {shallow} from '../../../test-utils'
import {IconButton} from './icon-button'

describe('src/app/js/shared/component/buttons/icon-button/icon-button.spec.js', () => {

    it('should render icon button with close icon and white color', () => {
        expect(shallow(<IconButton type="close" color="white" />)).toMatchSnapshot()
    })
})
