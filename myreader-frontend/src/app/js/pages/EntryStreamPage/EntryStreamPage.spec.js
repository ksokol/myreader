import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {EntryStreamPage} from './EntryStreamPage'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'
import {useSettings} from '../../contexts/settings'

jest.unmock('react-router')

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

async function clickButtonPrevious() {
  return act(async () => fireEvent.click(screen.getByRole('previous')))
}

async function clickButtonNext() {
  return act(async () => fireEvent.click(screen.getByRole('next')))
}

async function pressEscape() {
  return act(async () => fireEvent.keyDown(document, {key: 'Escape', keyCode: 27}))
}

async function pressArrowLeft() {
  return act(async () => fireEvent.keyDown(document, {key: 'ArrowLeft', keyCode: 37}))
}

async function pressArrowRight() {
  return act(async () => fireEvent.keyDown(document, {key: 'ArrowRight', keyCode: 39}))
}

const entry1Url = 'api/2/subscriptionEntries/1'
const entry2Url = 'api/2/subscriptionEntries/2'
const expectedError = 'expected error'

function ToggleUnseenTestComponent() {
  const {
    showUnseenEntries,
    setShowUnseenEntries,
  } = useSettings()

  return (
    <button
      data-testid='toggle-unseen'
      onClick={() => setShowUnseenEntries(!showUnseenEntries)}
    />
  )
}

describe('EntryStreamPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <>
          <div id='portal-header'/>
          <Router history={history}>
            <SubscriptionProvider>
              <SettingsProvider>
                <ToggleUnseenTestComponent />
                <EntryStreamPage/>
              </SettingsProvider>
            </SubscriptionProvider>
          </Router>
        </>
      )
    })
  }

  beforeEach(async () => {
    history = createMemoryHistory()

    await act(async () => {
      history.push({
        search: 'feedTagEqual=a'
      })
    })

    localStorage.setItem('myreader-settings', '{"showUnseenEntries": false}')

    fetch.jsonResponse({
      content: [{...entry1}, {...entry2}],
      next: 'http://localhost/test?nextpage'
    })
  })

  it('should fetch entries without seenEqual if showUnseenEntries is set to false', async () => {
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?feedTagEqual=a'
    })
  })

  it('should fetch entries with seenEqual set to true and prop "searchParams.seenEqual" set to true', async () => {
    history = createMemoryHistory()
    await act(async () => {
      history.push({
        search: 'seenEqual=true'
      })
    })
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?seenEqual=true'
    })
  })

  it('should fetch entries when search query changed', async () => {
    await renderComponent()
    await act(async () => {
      history.push({
        search: 'seenEqual=true&feedTagEqual=a'
      })
    })

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?feedTagEqual=a&seenEqual=true'
    })
  })

  describe('focus next', () => {

    it('should focus and update entry when button clicked', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await clickButtonNext()

      expect(screen.getByRole('focus')).toHaveTextContent('title1')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry1Url,
        body: {
          seen: true,
          tags: entry1.tags
        }
      })

      fetch.jsonResponseOnce({...entry2, seen: true})
      await clickButtonNext()

      expect(screen.getByRole('focus')).toHaveTextContent('title2')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry2Url,
        body: {
          seen: true,
          tags: entry2.tags
        }
      })
    })

    it('should focus and update entry when hotkey pressed', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()

      expect(screen.getByRole('focus')).toHaveTextContent('title1')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry1Url,
        body: {
          seen: true,
          tags: entry1.tags
        }
      })

      fetch.jsonResponseOnce({...entry2, seen: true})
      await pressArrowRight()

      expect(screen.getByRole('focus')).toHaveTextContent('title2')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry2Url,
        body: {
          seen: true,
          tags: entry2.tags
        }
      })
    })

    it('should focus last entry when button clicked', async () => {
      await renderComponent()
      fetch.resetMocks()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await clickButtonNext()

      fetch.jsonResponseOnce({...entry2, seen: true})
      await clickButtonNext()
      await clickButtonNext()

      expect(screen.getByRole('focus')).toHaveTextContent('title2')
      expect(fetch.requestCount()).toEqual(2)
    })

    it('should focus last entry when hotkey pressed', async () => {
      await renderComponent()
      fetch.resetMocks()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()

      fetch.jsonResponseOnce({...entry2, seen: true})
      await pressArrowRight()
      await pressArrowRight()

      expect(screen.getByRole('focus')).toHaveTextContent('title2')
      expect(fetch.requestCount()).toEqual(2)
    })
  })

  describe('previous entry', () => {

    it('initially should not focus entry when button clicked', async () => {
      await renderComponent()
      fetch.resetMocks()

      await clickButtonPrevious()

      expect(screen.queryByRole('focus')).not.toBeInTheDocument()
      expect(fetch.requestCount()).toEqual(0)
    })

    it('initially should not focus entry when hotkey pressed', async () => {
      await renderComponent()
      fetch.resetMocks()

      await pressArrowLeft()

      expect(screen.queryByRole('focus')).not.toBeInTheDocument()
      expect(fetch.requestCount()).toEqual(0)
    })

    it('should not focus entry when button clicked', async () => {
      await renderComponent()
      fetch.resetMocks()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await clickButtonNext()
      await clickButtonPrevious()

      expect(screen.queryByRole('focus')).not.toBeInTheDocument()
      expect(fetch.requestCount()).toEqual(1)
    })

    it('should not focus entry when hotkey pressed', async () => {
      await renderComponent()
      fetch.resetMocks()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()
      await pressArrowLeft()

      expect(screen.queryByRole('focus')).not.toBeInTheDocument()
      expect(fetch.requestCount()).toEqual(1)
    })

    it('should focus and update entry when button clicked', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await clickButtonNext()

      fetch.jsonResponseOnce({...entry2, seen: true})
      await clickButtonNext()
      await clickButtonPrevious()

      expect(screen.getByRole('focus')).toHaveTextContent('title1')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry2Url,
        body: {
          seen: true,
          tags: entry2.tags
        }
      })
    })

    it('should focus and update entry when hotkey clicked', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()
      await pressArrowLeft()

      expect(screen.getByRole('focus')).toHaveTextContent('title1')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry2Url,
        body: {
          seen: true,
          tags: entry2.tags
        }
      })
    })
  })

  describe('toggle seen flag', () => {

    it('should not update any entry', async () => {
      await renderComponent()
      fetch.resetMocks()

      await pressEscape()

      expect(fetch.requestCount()).toEqual(0)
    })

    it('should not update entry', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()

      fetch.jsonResponseOnce({...entry1, seen: false})
      await pressEscape()

      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry1Url,
        body: {
          seen: false,
          tags: ['expected tag1']
        }
      })

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressEscape()

      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry1Url,
        body: {
          seen: true,
          tags: ['expected tag1']
        }
      })
    })
  })

  it('should load next page', async () => {
    await renderComponent()

    fetch.jsonResponse({content: [{...entry3}, {...entry4}], next: null})
    await act(async () => fireEvent.click(screen.getByRole('more')))

    expect(screen.queryByTitle('title1')).toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
    expect(screen.queryByTitle('title3')).toBeInTheDocument()
    expect(screen.queryByTitle('title4')).toBeInTheDocument()
    expect(screen.queryByRole('more')).not.toBeInTheDocument()
  })

  it('should show empty page when loading', async () => {
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

    fetch.jsonResponse({content: [{...entry2}, {...entry3}], next: null})
    await act(async () => fireEvent.click(screen.getByRole('refresh')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptions'
    })
    expect(fetch.nthRequest(2)).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?feedTagEqual=a'
    })
    expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
    expect(screen.queryByTitle('title3')).toBeInTheDocument()
    expect(screen.queryByRole('focus')).not.toBeInTheDocument()
  })

  it('should reload content on page once if refresh icon button clicked twice', async () => {
    await renderComponent()
    fetch.resetMocks()

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
      url: 'api/2/subscriptionEntries?feedTagEqual=a',
    })
  })

  it('should reset focus when refreshing entries', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({...entry1, seen: true})
    await clickButtonNext()

    fetch.jsonResponse({content: [{...entry1}, {...entry2}], next: null})
    await act(async () => fireEvent.click(screen.getByRole('refresh')))

    expect(screen.queryByRole('focus')).not.toBeInTheDocument()
  })

  it('should retain focus when loading next page', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({...entry1, seen: true})
    await clickButtonNext()

    fetch.jsonResponse({content: [{...entry3}, {...entry4}], next: null})
    await act(async () => fireEvent.click(screen.getByRole('more')))

    expect(screen.queryByRole('focus')).toHaveTextContent('title1')
  })

  it('should render entries', async () => {
    await renderComponent()

    expect(screen.queryByTitle('title1')).toBeInTheDocument()
    expect(screen.queryByTitle('title2')).toBeInTheDocument()
  })

  it('should show an error message if entries could not be fetched', async () => {
    fetch.rejectResponse({data: expectedError})
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

  it('should show error messages if read flag could not be toggled for multiple entries', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await clickButtonNext()
    fetch.rejectResponse({data: expectedError})
    await pressEscape()
    fetch.rejectResponse({data: expectedError})
    await pressEscape()

    expect(screen.getAllByRole('dialog-error-message')[0]).toHaveTextContent(expectedError)
    expect(screen.getAllByRole('dialog-error-message')[1]).toHaveTextContent(expectedError)
  })

  it('should refresh entries if "showUnseenEntries" changed', async () => {
    await renderComponent()
    fetch.resetMocks()

    fetch.jsonResponse({
      content: [{...entry3}, {...entry4}],
    })

    await act(async () => fireEvent.click(screen.getByTestId('toggle-unseen')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?feedTagEqual=a&seenEqual=false'
    })

    expect(screen.queryByTitle('title1')).not.toBeInTheDocument()
    expect(screen.queryByTitle('title2')).not.toBeInTheDocument()
    expect(screen.queryByTitle('title3')).toBeInTheDocument()
    expect(screen.queryByTitle('title4')).toBeInTheDocument()
  })
})
