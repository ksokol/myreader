import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {fireEvent, render, screen} from '@testing-library/react'
import {SettingsProvider} from '../../../contexts/settings/SettingsProvider'
import {SettingsNavigationItem} from './SettingsNavigationItem'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('SettingsNavigationItem', () => {

  let props, history

  const renderComponent = async () => {
    render(
      <Router history={history}>
        <SettingsProvider>
          <SettingsNavigationItem {...props} />
        </SettingsProvider>
      </Router>
    )
  }

  beforeEach(() => {
    history = createMemoryHistory()

    localStorage.setItem('myreader-settings', '{"showUnseenEntries":false, "showEntryDetails":true}')

    props = {
      onClick: jest.fn()
    }
  })

  it('should not show settings', () => {
    renderComponent()

    expect(screen.queryByLabelText('Show all entries')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Show entry content')).not.toBeInTheDocument()
  })

  it('should show settings if item clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Settings'))

    expect(screen.getByLabelText('Show all entries')).toBeChecked()
    expect(screen.getByLabelText('Show entry content')).toBeChecked()
  })

  it('should trigger setShowEntryDetails with changed showUnseenEntries value', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Settings'))
    fireEvent.click(screen.getByLabelText('Show all entries'))

    expect(screen.getByLabelText('Show all entries')).not.toBeChecked()
    expect(localStorage.getItem('myreader-settings')).toEqual('{"showUnseenEntries":true,"showEntryDetails":true}')
  })

  it('should trigger setShowUnseenEntries with changed showEntryDetails value', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Settings'))
    fireEvent.click(screen.getByLabelText('Show entry content'))

    expect(screen.getByLabelText('Show entry content')).not.toBeChecked()
    expect(localStorage.getItem('myreader-settings')).toEqual('{"showUnseenEntries":false,"showEntryDetails":false}')
  })

  it('should trigger prop function "onClick" if settings should be hidden', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Settings'))
    fireEvent.click(screen.getByRole('close-dialog'))

    expect(props.onClick).toHaveBeenCalled()
  })

  it('should not trigger prop function "onClick" if item clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByText('Settings'))

    expect(props.onClick).not.toHaveBeenCalled()
  })
})
