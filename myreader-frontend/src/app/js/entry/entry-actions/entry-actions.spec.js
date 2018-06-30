import React from 'react'
import {shallowOutput} from '../../shared/test-utils'
import {EntryActions} from './entry-actions'
import TestRenderer from 'react-test-renderer'

describe('src/app/js/entry/entry-actions/entry-actions.spec.js', () => {

    let props

    beforeEach(() => {
        props = {
            onToggleShowMore: jest.fn(),
            onToggleSeen: jest.fn(),
            seen: true
        }
    })

    it('should render expand-more and check-circle icon buttons', () => {
        expect(shallowOutput(<EntryActions {...props} />)).toMatchSnapshot()
    })

    it('should render expand-less and check icon buttons', () => {
        props.seen = false
        props.showMore = true
        expect(shallowOutput(<EntryActions {...props} />)).toMatchSnapshot()
    })

    it('should trigger onToggleShowMore with expand-more icon button', () => {
        const instance = TestRenderer.create(<EntryActions {...props} />).root
        instance.findByProps({type: 'expand-more'}).props.onClick()

        expect(props.onToggleShowMore).toHaveBeenCalled()
    })

    it('should trigger onToggleSeen with check-circle icon button', () => {
        const instance = TestRenderer.create(<EntryActions {...props} />).root
        instance.findByProps({type: 'check-circle'}).props.onClick()

        expect(props.onToggleSeen).toHaveBeenCalledWith()
    })

    it('should trigger onToggleShowMore with expand-less icon button', () => {
        props.showMore = true
        const instance = TestRenderer.create(<EntryActions {...props} />).root
        instance.findByProps({type: 'expand-less'}).props.onClick()

        expect(props.onToggleShowMore).toHaveBeenCalled()
    })

    it('should trigger onToggleSeen with check icon button', () => {
        props.seen = false
        const instance = TestRenderer.create(<EntryActions {...props} />).root
        instance.findByProps({type: 'check'}).props.onClick()

        expect(props.onToggleSeen).toHaveBeenCalledWith()
    })
})
