import React from 'react'
import {shallow} from '../../test-utils'
import {Icon} from './icon'

describe('src/app/js/shared/component/icon/icon.spec.js', () => {

    it('should render close icon with default color', () => {
        expect(shallow(<Icon type="close" />))
            .toEqual(<span className="my-icon my-icon__close my-icon--grey" />)
    })

    it('should render close icon with white color', () => {
        expect(shallow(<Icon type="close" color="white" />))
            .toEqual(<span className="my-icon my-icon__close my-icon--white" />)
    })
})
