import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {createMockStore} from '../../shared/test-utils'
import SettingsContainer from './SettingsContainer'
import {Settings} from '../../components'

describe('SettingsContainer', () => {

  let store

  const createShallow = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SettingsContainer />
      </Provider>
    )
    return wrapper.find(Settings)
  }

  beforeEach(() => {
    store = createMockStore()
    store.setState({
      settings: {
        pageSize: 20,
        showUnseenEntries: false,
        showEntryDetails: true
      }
    })
  })

  it('should initialize settings component with given settings', () => {
    expect(createShallow().prop('settings')).toEqual({
      pageSize: 20,
      showUnseenEntries: false,
      showEntryDetails: true
    })
  })

  it('should dispatch action with given settings', () => {
    const wrapper = createShallow()

    wrapper.props().onChange({
      pageSize: 10,
      showUnseenEntries: true,
      showEntryDetails: false
    })

    expect(store.getActions()[0]).toEqual({
      type: 'SETTINGS_UPDATE',
      settings: {
        pageSize: 10,
        showUnseenEntries: true,
        showEntryDetails: false
      }
    })
  })
})
