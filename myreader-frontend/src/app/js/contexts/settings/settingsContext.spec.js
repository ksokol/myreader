import React from 'react'
import {mount} from 'enzyme'
import {SettingsProvider} from './SettingsProvider'
import SettingsContext from './SettingsContext'

class TestComponent extends React.Component {
  static contextType = SettingsContext
  render = () => 'expected component'
}

describe('', () => {

  let state

  const createWrapper = () => {
    return mount(
      <SettingsProvider state={state}>
        <TestComponent />
      </SettingsProvider>
    ).find(TestComponent)
  }

  beforeEach(() => {
    state = {
      settings: {
        a: 'b',
        pageSize: 5,
        showUnseenEntries: true,
        showEntryDetails: true
      }
    }
  })

  it('should render children', () => {
    expect(createWrapper().html()).toEqual('expected component')
  })

  it('should contain expected context values in child component', () => {
    expect(createWrapper().instance().context).toEqual({
      pageSize: 5,
      showUnseenEntries: true,
      showEntryDetails: true
    })
  })
})
