import {Chip} from './chip'
import React from 'react'
import TestRenderer from 'react-test-renderer'

describe('src/app/js/shared/component/chips/chip.spec.js', () => {

    const create = props => TestRenderer.create(<Chip {...props} />).toJSON().props

    it('should not mark as selected', () => {
        expect(create({value: 'test'}).className).not.toContain('my-chip--selected')
    })

    it('should mark as selected', () => {
        expect(create({value: 'test', selected: 'test'}).className).toContain('my-chip--selected')
    })

    it('should not mark as selectable when selected but onSelect function is undefined', () => {
        expect(create({value: 'test', selected: 'test'}).className).not.toContain('my-chip--selectable')
    })

    it('should not mark as selectable when already selected', () => {
        expect(create({value: 'test', selected: 'test', onSelect: () => {}}).className).not.toContain('my-chip--selectable')
    })

    it('should mark as selectable when not selected and onSelect function is defined', () => {
        expect(create({value: 'test', onSelect: () => {}}).className).toContain('my-chip--selectable')
    })

    it('should trigger onSelect function on click', () => {
        const onSelect = jest.fn()
        TestRenderer.create(<Chip value={'test'} onSelect={onSelect} />).root.children[0].props.children.props.onClick()

        expect(onSelect).toHaveBeenCalled()
    })
})
