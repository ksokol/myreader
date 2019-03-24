import React from 'react'
import {shallow} from 'enzyme'
import ListLayout from './ListLayout'
import {SearchInput, IconButton} from '../../components'

jest.mock('react-router-dom', () => ({
  withRouter: WrappedComponent => WrappedComponent,
}))

describe('ListLayout', () => {

  let props

  const createComponent = () => shallow(
    <ListLayout
      {...props}
      actionPanel={<div className='action'/>}
      listPanel={<div className='list' />}
    />
  )

  beforeEach(() => {
    props = {
      location: {
        _currentRoute: ['path'],
        search: '?a=b&q=expected q'
      },
      onRefresh: jest.fn(),
      history: {
        push: jest.fn()
      }
    }
  })

  it('should pass expected props to search input component', () => {
    expect(createComponent().find(SearchInput).prop('value')).toEqual('expected q')
  })

  it('should trigger prop function "history.push" when search input value changed', () => {
    createComponent().find(SearchInput).props().onChange('changed q')

    expect(props.history.push).toHaveBeenCalledWith({
      _currentRoute: ['path'],
      search: '?a=b&q=expected q',
      query: {a: 'b', q: 'changed q'}
    })
  })

  it('should pass expected props to icon button component', () => {
    expect(createComponent().find(IconButton).prop('type')).toEqual('redo')
  })

  it('should trigger prop function "onRefresh" when icon button clicked', () => {
    createComponent().find(IconButton).props().onClick()

    expect(props.onRefresh).toHaveBeenCalled()
  })

  it('should render result of prop function "actionPanel"', () => {
    const actionPanel = createComponent().find('[className="my-list-layout__action-panel"]').find('[className="action"]')

    expect(actionPanel.exists()).toEqual(true)
  })

  it('should render result of prop function "listPanel"', () => {
    const listPanel = createComponent().find('[className="my-list-layout__list-content"]').find('[className="list"]')

    expect(listPanel.exists()).toEqual(true)
  })
})
