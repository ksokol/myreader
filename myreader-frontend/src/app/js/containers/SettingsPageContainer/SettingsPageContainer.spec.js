import React from 'react'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {createMockStore} from '../../shared/test-utils'
import SettingsPageContainer from './SettingsPageContainer'
import {SettingsPage} from '../../pages'

describe('SettingsPageContainer', () => {

  let store

  const createShallow = () => {
    const wrapper = mount(
      <Provider store={store}>
        <SettingsPageContainer />
      </Provider>
    )
    return wrapper.find(SettingsPage)
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
