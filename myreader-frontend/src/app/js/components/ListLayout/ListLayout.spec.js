import React from 'react'
import {mount} from 'enzyme'
import {ListLayout} from './ListLayout'
import {useHistory} from '../../hooks/router'

/* eslint-disable react/prop-types */
jest.mock('..', () => ({
  SearchInput: () => <div />,
  IconButton: () => <div />
}))

jest.mock('../../hooks/router', () => {
  const push = jest.fn()
  const reload = jest.fn()

  return {
    useSearchParams: jest.fn().mockReturnValue({
      a: 'b',
      q: 'q'
    }),
    useHistory: () => ({
      push,
      reload,
    })
  }
})
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
      historyReload: jest.fn(),
      historyPush: jest.fn()
    }
  })

  it('should pass expected props to search input component', () => {
    expect(createWrapper().find('SearchInput').prop('value')).toEqual('q')
  })

  it('should trigger history push when search input value changed', () => {
    createWrapper().find('SearchInput').props().onChange('changed q')

    expect(useHistory().push).toHaveBeenCalledWith({
      searchParams: {
        a: 'b',
        q: 'changed q'
      }
    })
  })

  it('should trigger history reload when refresh icon button clicked', () => {
    createWrapper().find('IconButton').props().onClick()

    expect(useHistory().reload).toHaveBeenCalled()
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
