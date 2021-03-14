import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {BookmarkListPage} from './BookmarkListPage'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'

jest.unmock('react-router')
jest.unmock('react-router-dom')

const entry1 = Object.freeze({
  uuid: '1',
  title: 'title1',
  feedTitle: 'expected feedTitle1',
  tags: ['expected tag1'],
  origin: 'expected origin1',
  seen: false,
  createdAt: 'expected createdAt',
  content: 'expected content1',
})

const entry2 = Object.freeze({
  uuid: '2',
  title: 'title2',
  feedTitle: 'expected feedTitle2',
  tags: ['expected tag2'],
  origin: 'expected origin2',
  seen: false,
  createdAt: 'expected createdAt2',
  content: 'expected content2',
})

const entry3 = Object.freeze({
  uuid: '3',
  title: 'title3',
  feedTitle: 'expected feedTitle3',
  tags: ['expected tag3'],
  origin: 'expected origin3',
  seen: false,
  createdAt: 'expected createdAt3',
  content: 'expected content3',
})

const entry4 = Object.freeze({
  uuid: '4',
  title: 'title4',
  feedTitle: 'expected feedTitle4',
  tags: ['expected tag4'],
  origin: 'expected origin4',
  seen: false,
  createdAt: 'expected createdAt4',
  content: 'expected content4',
})

const expectedError = 'expected error'

describe('BookmarkListPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <>
          <div id='portal-header' />
          <Router history={history}>
            <SubscriptionProvider>
              <SettingsProvider>
                <BookmarkListPage />
              </SettingsProvider>
            </SubscriptionProvider>
          </Router>
        </>
      )
    })
  }

  beforeEach(async () => {
    history = createMemoryHistory()

    localStorage.setItem('myreader-settings', '{"showUnseenEntries": false}')

    fetch.jsonResponseOnce({
      content: [{...entry1}, {...entry2}],
      next: 'http://localhost/test?nextpage',
    })
  })

  it('should fetch entries without seenEqual', async () => {
    history = createMemoryHistory()
    await act(async () => {
      history.push({search: 'entryTagEqual=expectedTag'})
    })
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?entryTagEqual=expectedTag'
    })
  })

  it('should fetch entries with seenEqual set to true', async () => {
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?entryTagEqual=&seenEqual=true'
    })
  })

  it('should render entries', async () => {
    fetch.jsonResponseOnce({content: [{...entry2}], next: null,})
    await renderComponent()

    expect(screen.queryByTitle('title2')).toBeInTheDocument()
  })

  it('should load next page', async () => {
    await renderComponent()

    fetch.jsonResponse({content: [{...entry3}, {...entry4}], next: null,})
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

    fetch.jsonResponseOnce({content: [{...entry2}, {...entry3}], next: null,})
    await act(async () => fireEvent.click(screen.getByRole('refresh')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptions'
    })
    expect(fetch.nthRequest(2)).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?entryTagEqual=&seenEqual=true'
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
    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptions'
    })
    expect(fetch.nthRequest(2)).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?entryTagEqual=&seenEqual=true',
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
