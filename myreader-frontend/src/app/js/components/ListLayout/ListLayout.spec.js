import React from 'react'
import {mount} from 'enzyme'
import ListLayout from './ListLayout'

/* eslint-disable react/prop-types */
jest.mock('..', () => ({
  SearchInput: () => <div />,
  IconButton: () => <div />
}))

jest.mock('../../contexts/locationState/withLocationState', () => ({
  withLocationState: Component => Component
}))
/* eslint-enable */

describe('ListLayout', () => {

  let props

  const createWrapper = () => mount(
    <ListLayout
      {...props}
      actionPanel={<div className='action'/>}
      listPanel={<div className='list' />}
    />
  )

  beforeEach(() => {
    props = {
      searchParams: {
        a: 'b',
        q: 'q'
      },
      historyReload: jest.fn(),
      historyPush: jest.fn()
    }
  })

  it('should pass expected props to search input component', () => {
    expect(createWrapper().find('SearchInput').prop('value')).toEqual('q')
  })

  it('should trigger prop function "historyPush" when search input value changed', () => {
    createWrapper().find('SearchInput').props().onChange('changed q')

    expect(props.historyPush).toHaveBeenCalledWith({
      searchParams: {
        a: 'b',
        q: 'changed q'
      }
    })
  })

  it('should trigger prop function "historyReplace" when refresh icon button clicked', () => {
    createWrapper().find('IconButton').props().onClick()

    expect(props.historyReload).toHaveBeenCalled()
  })

  it('should pass expected props to icon button component', () => {
    expect(createWrapper().find('IconButton').prop('type')).toEqual('redo')
  })

  it('should render result of prop function "actionPanel"', () => {
    const actionPanel = createWrapper().find('[className="my-list-layout__action-panel"]').find('[className="action"]')

    expect(actionPanel.exists()).toEqual(true)
  })

  it('should render result of prop function "listPanel"', () => {
    const listPanel = createWrapper().find('[className="my-list-layout__list-content"]').find('[className="list"]')

    expect(listPanel.exists()).toEqual(true)
  })
})
