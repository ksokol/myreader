import React from 'react'
import {mount} from 'enzyme'
import {ListLayout} from './ListLayout'

describe('ListLayout', () => {

  const createWrapper = () => mount(
    <ListLayout
      actionPanel={<div className='action'/>}
      listPanel={<div className='list' />}
    />
  )

  it('should render result of prop function "actionPanel"', () => {
    const actionPanel = createWrapper().find('[className="my-list-layout__action-panel"]').find('[className="action"]')

    expect(actionPanel.exists()).toEqual(true)
  })

  it('should render result of prop function "listPanel"', () => {
    const listPanel = createWrapper().find('[className="my-list-layout__list-content"]').find('[className="list"]')

    expect(listPanel.exists()).toEqual(true)
  })
})
