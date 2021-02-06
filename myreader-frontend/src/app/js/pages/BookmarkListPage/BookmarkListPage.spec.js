import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {entry1, entry2, entry3, entry4} from '../../shared/test-utils'
import {BookmarkListPage} from './BookmarkListPage'
import {LocationStateProvider} from '../../contexts/locationState/LocationStateProvider'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

const expectedError = 'expected error'

describe('BookmarkListPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <>
          <div id='portal-header' />
          <Router history={history}>
            <LocationStateProvider>
              <SettingsProvider>
                <BookmarkListPage />
              </SettingsProvider>
            </LocationStateProvider>
          </Router>
        </>
      )
    })
  }

  beforeEach(async () => {
    history = createMemoryHistory()

    localStorage.setItem('myreader-settings', '{"pageSize": 2, "showUnseenEntries": false}')

    fetch.jsonResponseOnce(['expected tag1', 'expected tag2'])
    fetch.jsonResponseOnce({
      content: [{...entry1}, {...entry2}],
      links: [{
        rel: 'next',
        href: 'http://localhost/test?nextpage'
      }],
    })
  })

  it('should render expected entry tags as chips', async () => {
    await renderComponent()

    expect(screen.getAllByRole('chip')[0]).toHaveTextContent('expected tag1')
    expect(screen.getAllByRole('chip')[1]).toHaveTextContent('expected tag2')
  })

  it('should render expected entry tag as selected chip', async () => {
    history = createMemoryHistory()
    await act(async () => {
      history.push({search: 'entryTagEqual=expected tag2'})
    })
    await renderComponent()

    expect(screen.getAllByRole('chip')[0]).not.toHaveClass('my-chip--selected')
    expect(screen.getAllByRole('chip')[1]).toHaveClass('my-chip--selected')
  })

  it('should fetch entry tags', async () => {
    await renderComponent()

    expect(fetch.first()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries/availableTags'
    })
  })

  it('should fetch entries with seenEqual set to "*"', async () => {
    history = createMemoryHistory()
    await act(async () => {
      history.push({search: 'entryTagEqual=expectedTag'})
    })
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?entryTagEqual=expectedTag&seenEqual=*&size=2'
    })
  })

  it('should fetch entries with seenEqual set to empty string', async () => {
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?seenEqual=&size=2'
    })
  })

  it('should render entries', async () => {
    fetch.jsonResponseOnce({content: [{...entry2}], links: [],})
    await renderComponent()

    expect(screen.queryByTitle('title2')).toBeInTheDocument()
  })

  it('should fetch entries for selected entry tag', async () => {
    fetch.jsonResponseOnce({content: [{...entry2}], links: [],})
    await renderComponent()

    await act(async () => fireEvent.click(screen.getByText('expected tag1')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?size=2&seenEqual=*&entryTagEqual=expected tag1'
    })
  })

  it('should load next page', async () => {
    await renderComponent()

    fetch.jsonResponse({content: [{...entry3}, {...entry4}], links: [],})
    await act(async () => fireEvent.click(screen.getByRole('more')))

    expect(screen.queryByTitle('title1')).toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
    expect(screen.queryByTitle('title3')).toBeInTheDocument()
    expect(screen.queryByTitle('title4')).toBeInTheDocument()
    expect(screen.queryByRole('more')).not.toBeInTheDocument()
  })

  it('should show empty page when loading', async () => {
    fetch.mockReset()
    fetch.responsePending()
    await renderComponent()

    expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
    expect(screen.queryByTitle('title2')).not.toBeInTheDocument()
    expect(screen.queryByRole('more')).not.toBeInTheDocument()
  })

  it('should disable more button when loading', async () => {
    await renderComponent()

    fetch.responsePending()
    await act(async () => fireEvent.click(screen.getByRole('more')))

    expect(screen.queryByRole('more')).toBeDisabled()
  })

  it('should enable more button when loading failed', async () => {
    await renderComponent()
    expect(screen.queryByRole('more')).toBeEnabled()

    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getByRole('more')))

    expect(screen.queryByRole('more')).toBeEnabled()
  })

  it('should reload content on page when refresh icon button clicked', async () => {
    await renderComponent()

    fetch.jsonResponseOnce(['expected tag1', 'expected tag2'])
    fetch.jsonResponseOnce({content: [{...entry2}, {...entry3}], links: [],})
    await act(async () => fireEvent.click(screen.getByRole('refresh')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?seenEqual=&size=2',
    })
    expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
    expect(screen.queryByTitle('title3')).toBeInTheDocument()
  })

  it('should reload content on page once if refresh icon button clicked twice', async () => {
    await renderComponent()
    fetch.resetMocks()
    fetch.responsePending()
    fetch.responsePending()
    act(() => {
      fireEvent.click(screen.getByRole('refresh'))
    })
    act(() => {
      fireEvent.click(screen.getByRole('refresh'))
    })

    expect(fetch.requestCount()).toEqual(2)
    expect(fetch.first()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries/availableTags',
    })
    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?seenEqual=&size=2',
    })
  })

  it('should render entries', async () => {
    await renderComponent()

    expect(screen.queryByTitle('title1')).toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
  })

  it('should show an error message if entry tags could not be fetched', async () => {
    fetch.mockReset()
    fetch.rejectResponse({data: expectedError})
    fetch.jsonResponseOnce({content: []})
    await renderComponent()

    expect(screen.getByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })

  it('should show an error message if entries could not be fetched', async () => {
    fetch.mockReset()
    fetch.jsonResponseOnce([])
    fetch.rejectResponse({data: `${expectedError}2`})
    await renderComponent()

    expect(screen.getByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })

  it('should show error messages if read flag could not be set for multiple entries', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getAllByRole('check')[0]))
    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getAllByRole('check')[1]))

    expect(screen.getAllByRole('dialog-error-message')[0]).toHaveTextContent(expectedError)
    expect(screen.getAllByRole('dialog-error-message')[1]).toHaveTextContent(expectedError)
  })
})
