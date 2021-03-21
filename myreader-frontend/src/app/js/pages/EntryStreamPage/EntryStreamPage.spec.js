import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, fireEvent, screen, act} from '@testing-library/react'
import {mockAllIsIntersecting} from 'react-intersection-observer/test-utils'
import {EntryStreamPage} from './EntryStreamPage'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'
import {useSettings} from '../../contexts/settings'

const entry1 = Object.freeze({
  uuid: '1',
  title: 'title1',
  feedTitle: 'expected feedTitle1',
  tags: ['expected tag1'],
  origin: 'expected origin1',
  seen: false,
  createdAt: '2021-02-27T06:48:05.087+01:00',
  content: 'expected content1'
})

const entry2 = Object.freeze({
  uuid: '2',
  title: 'title2',
  feedTitle: 'expected feedTitle2',
  tags: ['expected tag2'],
  origin: 'expected origin2',
  seen: false,
  createdAt: '2021-02-27T07:48:05.087+01:00',
  content: 'expected content2'
})

const entry3 = Object.freeze({
  uuid: '3',
  title: 'title3',
  feedTitle: 'expected feedTitle3',
  tags: ['expected tag3'],
  origin: 'expected origin3',
  seen: false,
  createdAt: '2021-02-27T08:48:05.087+01:00',
  content: 'expected content3'
})

const entry4 = Object.freeze({
  uuid: '4',
  title: 'title4',
  feedTitle: 'expected feedTitle4',
  tags: ['expected tag4'],
  origin: 'expected origin4',
  seen: false,
  createdAt: '2021-02-27T09:48:05.087+01:00',
  content: 'expected content4'
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

function SettingsTestComponent() {
  const {
    showUnseenEntries,
    setShowUnseenEntries,
    setShowEntryDetails,
    showEntryDetails
  } = useSettings()

  return (
    <>
      <button
        data-testid='toggle-unseen'
        onClick={() => setShowUnseenEntries(!showUnseenEntries)}
      />
      <button
        data-testid='toggle-details'
        onClick={() => setShowEntryDetails(!showEntryDetails)}
      />
    </>
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
                <SettingsTestComponent/>
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

    localStorage.setItem('myreader-settings', '{"showUnseenEntries": false, "showEntryDetails": true}')

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

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title1')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry1Url,
        body: {
          seen: true,
          tags: entry1.tags
        }
      })

      fetch.jsonResponseOnce({...entry2, seen: true})
      await clickButtonNext()

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title2')
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

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title1')
      expect(fetch.mostRecent()).toMatchPatchRequest({
        url: entry1Url,
        body: {
          seen: true,
          tags: entry1.tags
        }
      })

      fetch.jsonResponseOnce({...entry2, seen: true})
      await pressArrowRight()

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title2')
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

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title2')
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

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title2')
      expect(fetch.requestCount()).toEqual(2)
    })
  })

  describe('previous entry', () => {

    it('initially should not focus entry when button clicked', async () => {
      await renderComponent()
      fetch.resetMocks()

      await clickButtonPrevious()

      expect(screen.queryByRole('entry-in-focus')).not.toBeInTheDocument()
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

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title1')
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

      expect(screen.getByRole('entry-in-focus')).toHaveTextContent('title1')
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

    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
    expect(screen.queryByText('title4')).toBeInTheDocument()
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

  it('should hide more button if there are no more entries to fetch', async () => {
    fetch.resetMocks()
    fetch.jsonResponse({
      content: [{...entry1}, {...entry2}]
    })
    await renderComponent()

    expect(screen.queryByRole('more')).not.toBeInTheDocument()
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
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
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
      url: 'api/2/subscriptionEntries?feedTagEqual=a'
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

    expect(screen.queryByRole('entry-in-focus')).toHaveTextContent('title1')
  })

  it('should render entries', async () => {
    await renderComponent()

    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title1')).toHaveAttribute('href', 'expected origin1')
    expect(screen.queryByText('title1')).toHaveAttribute('target', '_blank')
    expect(screen.queryByText('title1')).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title2')).toHaveAttribute('href', 'expected origin2')
    expect(screen.queryByText('title2')).toHaveAttribute('target', '_blank')
    expect(screen.queryByText('title2')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should show an error message if entries could not be fetched', async () => {
    fetch.rejectResponse({data: expectedError})
    await renderComponent()

    expect(screen.getByRole('dialog-error-message')).toHaveTextContent(expectedError)
  })

  it('should toggle entry seen flag', async () => {
    await renderComponent()

    fetch.jsonResponse({...entry1, seen: true})
    await act(async () => fireEvent.click(screen.getAllByRole('flag-as-seen')[0]))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: true,
        tags: ['expected tag1']
      }
    })

    fetch.jsonResponse({...entry1, seen: false})
    await act(async () => fireEvent.click(screen.getAllByRole('flag-as-unseen')[0]))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: false,
        tags: ['expected tag1']
      }
    })
  })

  it('should show error messages if read flag could not be set for multiple entries', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getAllByRole('flag-as-seen')[0]))
    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getAllByRole('flag-as-seen')[1]))

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
      content: [{...entry3}, {...entry4}]
    })

    await act(async () => fireEvent.click(screen.getByTestId('toggle-unseen')))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?feedTagEqual=a&seenEqual=false'
    })

    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
    expect(screen.queryByText('title4')).toBeInTheDocument()
  })

  it('should fetch all entries if "seenEqual" is set to "*"', async () => {
    await act(async () => {
      history.push({
        search: 'seenEqual=*&entryTagEqual=a'
      })
    })
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries?entryTagEqual=a'
    })
  })

  it('should render entry contents', async () => {
    await renderComponent()

    expect(screen.getByText(entry1.content)).toHaveTextContent('expected content1')
    expect(screen.getByText(entry2.content)).toHaveTextContent('expected content2')
  })

  it('should not render entry contents if "showEntryDetails" setting is set to false', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId('toggle-details')))

    expect(screen.queryByText(entry1.content)).not.toBeInTheDocument()
    expect(screen.queryByText(entry2.content)).not.toBeInTheDocument()
  })

  it('should render entry1 content if "showEntryDetails" setting is set to false and details toggle clicked', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId('toggle-details')))
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    expect(screen.getByText(entry1.content)).toHaveTextContent('expected content1')
    expect(screen.queryByText(entry2.content)).not.toBeInTheDocument()
  })

  it('should hide entry1 content if "showEntryDetails" setting is set to false and details toggle clicked twice', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId('toggle-details')))
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))
    await act(async () => fireEvent.click(screen.getAllByRole('less-details')[0]))

    expect(screen.queryByText(entry1.content)).not.toBeInTheDocument()
    expect(screen.queryByText(entry2.content)).not.toBeInTheDocument()
  })

  it('should render entry title', async () => {
    await renderComponent()

    expect(screen.getByText(entry1.title)).toHaveTextContent('title1')
    expect(screen.getByText(entry2.title)).toHaveTextContent('title2')
  })

  it('should open entry url in new window safely', async () => {
    await renderComponent()

    expect(screen.getByText(entry1.title)).toHaveAttribute('href', entry1.origin)
    expect(screen.getByText(entry1.title)).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(entry1.title)).toHaveAttribute('target', '_blank')
    expect(screen.getByText(entry2.title)).toHaveAttribute('href', entry2.origin)
    expect(screen.getByText(entry2.title)).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText(entry2.title)).toHaveAttribute('target', '_blank')
  })

  it('should render entry feedTag and feedTagColor', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1614453487714)
    fetch.resetMocks()
    fetch.jsonResponse({
      content: [{
        ...entry1,
        feedTag: 'expected tag',
        feedTagColor: '#555555'
      }]
    })
    await renderComponent()

    expect(screen.getByText('13 hours ago on expected feedTitle1')).toBeInTheDocument()
    expect(screen.getByRole('feed-badge')).toHaveTextContent('expected tag')
    expect(screen.getByRole('feed-badge')).toHaveTextContent('expected tag')
    expect(screen.getByRole('feed-badge')).toHaveStyle('--red: 85; --green: 85; --blue: 85;')
  })

  it('should render tag input and tag for entry if details toggle clicked', async () => {
    await renderComponent()
    expect(screen.queryByPlaceholderText('Enter a tag...')).not.toBeInTheDocument()

    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    expect(screen.getByPlaceholderText('Enter a tag...')).toBeInTheDocument()
    expect(screen.getByText('expected tag1')).toBeInTheDocument()
    expect(screen.queryByText('expected tag2')).not.toBeInTheDocument()
  })

  it('should hide tag input and tag for entry if details toggle clicked twice', async () => {
    await renderComponent()
    expect(screen.queryByPlaceholderText('Enter a tag...')).not.toBeInTheDocument()

    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))
    await act(async () => fireEvent.click(screen.getAllByRole('less-details')[0]))

    expect(screen.queryByPlaceholderText('Enter a tag...')).not.toBeInTheDocument()
    expect(screen.queryByText('expected tag1')).not.toBeInTheDocument()
  })

  it('should remove last entry tag', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    await act(async () => await fireEvent.click(screen.getByRole('chip-remove-button')))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: false,
        tags: null
      }
    })
  })

  it('should remove second entry tag', async () => {
    fetch.resetMocks()
    fetch.jsonResponse({
      content: [{
        ...entry1,
        tags: ['tag1', 'tag2']
      }]
    })
    await renderComponent()
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    await act(async () => await fireEvent.click(screen.getAllByRole('chip-remove-button')[1]))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: false,
        tags: ['tag1']
      }
    })
  })

  it('should save first entry tag', async () => {
    fetch.resetMocks()
    fetch.jsonResponse({
      content: [{
        ...entry1,
        tags: []
      }]
    })
    await renderComponent()
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    await act(async () => await fireEvent.change(screen.getByPlaceholderText('Enter a tag...'), {target: {value: 'first tag'}}))
    await act(async () => await fireEvent.keyUp(screen.getByPlaceholderText('Enter a tag...'), {key: 'Enter', keyCode: 13}))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: false,
        tags: ['first tag']
      }
    })
  })

  it('should save second entry tag', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    await act(async () => await fireEvent.change(screen.getByPlaceholderText('Enter a tag...'), {target: {value: 'new tag'}}))
    await act(async () => await fireEvent.keyUp(screen.getByPlaceholderText('Enter a tag...'), {key: 'Enter', keyCode: 13}))

    expect(fetch.mostRecent()).toMatchPatchRequest({
      url: 'api/2/subscriptionEntries/1',
      body: {
        seen: false,
        tags: ['expected tag1', 'new tag']
      }
    })
  })

  it('should prevent duplicate entry tags', async () => {
    await renderComponent()
    fetch.resetMocks()
    await act(async () => fireEvent.click(screen.getAllByRole('more-details')[0]))

    await act(async () => await fireEvent.change(screen.getByPlaceholderText('Enter a tag...'), {target: {value: 'expected tag1'}}))
    await act(async () => await fireEvent.keyUp(screen.getByPlaceholderText('Enter a tag...'), {key: 'Enter', keyCode: 13}))

    expect(fetch.requestCount()).toEqual(0)
  })

  it('should fetch automatically next entries if last entry becomes visible', async () => {
    fetch.resetMocks()
    fetch.jsonResponse({content: [{...entry1}], next: 'http://localhost/test?next=2'})
    await renderComponent()

    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()

    fetch.jsonResponse({content: [{...entry2}]})
    await act(async () => mockAllIsIntersecting(true))

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'http://localhost/test?next=2'
    })

    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()

    fetch.resetMocks()
    await act(async () => mockAllIsIntersecting(true))

    expect(fetch.requestCount()).toEqual(0)
  })

  it('should not fetch any entries automatically if initial fetch returns no entries', async () => {
    fetch.resetMocks()
    fetch.jsonResponse({content: []})
    await renderComponent()

    await act(async () => mockAllIsIntersecting(true))

    expect(fetch.requestCount()).toEqual(1)
  })

  it('should scroll entry into view if next button clicked', async () => {
    await renderComponent()
    await clickButtonNext()

    expect(screen.getByRole('entry-in-focus').scrollIntoView).toHaveBeenCalled()
  })

  it('should scroll entry into view if hotkey pressed', async () => {
    await renderComponent()
    await pressArrowRight()

    expect(screen.getByRole('entry-in-focus').scrollIntoView).toHaveBeenCalled()
  })
})
