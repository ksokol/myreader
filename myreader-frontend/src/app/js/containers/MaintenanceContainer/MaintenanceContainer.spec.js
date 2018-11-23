import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {createMockStore} from '../../shared/test-utils'
import MaintenanceContainer from './MaintenanceContainer'
import {Maintenance} from '../../components'

describe('MaintenanceContainer', () => {

  let store

  const createComponent = () => {
    const wrapper = mount(
      <Provider store={store}>
        <MaintenanceContainer />
      </Provider>
    )
    return wrapper.find(Maintenance)
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      admin: {
        applicationInfo: {
          branch: 'expected branch',
          commitId: 'expected commitId',
          version: 'expected version',
          buildTime: 'expected builtTime'
        }
      }
    })
  })

  it('should dispatch action when prop function "onRefreshIndex" triggered', () => {
    createComponent().props().onRefreshIndex()

    expect(store.getActionTypes()).toEqual(['PUT_INDEX_SYNC_JOB'])
  })

  it('should initialize maintenance component with given application info', () => {
    expect(createComponent().prop('applicationInfo')).toEqual({
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected builtTime'
    })
  })
})
