import {render, fireEvent, screen, act, waitFor} from '@testing-library/react'
import {mockAllIsIntersecting} from 'react-intersection-observer/test-utils'
import {EntryStreamPage} from './EntryStreamPage'
import {SettingsProvider} from '../../contexts/settings/SettingsProvider'
import {NavigationProvider} from '../../contexts/navigation/NavigationProvider'
import {useSettings} from '../../contexts/settings'
import {RouterProvider} from '../../contexts/router'

const expectedContent1 = 'expected content1'
const api2SubscriptionEntries1 = 'api/2/subscriptionEntries/1'
const entry2Url = 'api/2/subscriptionEntries/2'
const expectedError = 'expected error'
const api2SubscriptionEntriesFeedTagEqualA = 'api/2/subscriptionEntries?feedTagEqual=a'
const roleEntryInFocus = 'entry-in-focus'
const noopenerNoreferrer = 'noopener noreferrer'
const roleDialogErrorMessage = 'dialog-error-message'
const roleFlagAsSeen = 'flag-as-seen'
const testIdToggleDetails = 'toggle-details'
const roleMoreDetails = 'more-details'
const expectedTag = 'expected tag'
const roleFeedBadge = 'feed-badge'

const entry1 = Object.freeze({
  uuid: '1',
  title: 'title1',
  feedTitle: 'expected feedTitle1',
  origin: 'expected origin1',
  seen: false,
  createdAt: '2021-02-27T06:48:05.087+01:00',
  content: expectedContent1
})

const entry2 = Object.freeze({
  uuid: '2',
  title: 'title2',
  feedTitle: 'expected feedTitle2',
  origin: 'expected origin2',
  seen: false,
  createdAt: '2021-02-27T07:48:05.087+01:00',
  content: 'expected content2'
})

const entry3 = Object.freeze({
  uuid: '3',
  title: 'title3',
  feedTitle: 'expected feedTitle3',
  origin: 'expected origin3',
  seen: false,
  createdAt: '2021-02-27T08:48:05.087+01:00',
  content: 'expected content3'
})

const entry4 = Object.freeze({
  uuid: '4',
  title: 'title4',
  feedTitle: 'expected feedTitle4',
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

const renderComponent = async () => {
  await act(async () =>
    await render(
      <>
        <div id='portal-header'/>
        <RouterProvider>
          <NavigationProvider>
            <SettingsProvider>
              <SettingsTestComponent/>
              <EntryStreamPage/>
            </SettingsProvider>
          </NavigationProvider>
        </RouterProvider>
      </>
    )
  )
}

describe('EntryStreamPage', () => {

  beforeEach(async () => {
    history.pushState(null, null, '#!/app/subscriptions?feedTagEqual=a')

    localStorage.setItem('myreader-settings', '{"showUnseenEntries": false, "showEntryDetails": true}')

    fetch.jsonResponse({
      content: [{...entry1}, {...entry2}],
      nextPage: {
        uuid: 3
      },
    })
  })

  it('should fetch entries without seenEqual if showUnseenEntries is set to false', async () => {
    await renderComponent()

    expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntriesFeedTagEqualA)
    expect(fetch.mostRecent().method).toEqual('GET')
  })

  it('should fetch entries with seenEqual set to true and prop "searchParams.seenEqual" set to true', async () => {
    history.pushState(null, null, '#!/app/subscriptions?seenEqual=true')
    await renderComponent()

    expect(fetch.mostRecent().url).toEqual('api/2/subscriptionEntries?seenEqual=true')
    expect(fetch.mostRecent().method).toEqual('GET')
  })

  it('should fetch entries when search query changed', async () => {
    await renderComponent()

    act(() => {
      history.pushState(null, null, '#!/app/entries?seenEqual=true&feedTagEqual=a')
      window.dispatchEvent(new Event('popstate'))
    })

    await waitFor(() => {
      expect(fetch.mostRecent().url).toEqual('api/2/subscriptionEntries?seenEqual=true&feedTagEqual=a')
      expect(fetch.mostRecent().method).toEqual('GET')
    })
  })

  describe('focus next', () => {

    it('should focus and update entry when button clicked', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await clickButtonNext()

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title1')
      expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntries1)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({
        seen: true,
      }))

      fetch.jsonResponseOnce({...entry2, seen: true})
      await clickButtonNext()

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title2')
      expect(fetch.mostRecent().url).toEqual(entry2Url)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({
        seen: true,
      }))
    })

    it('should focus and update entry when hotkey pressed', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title1')
      expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntries1)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({
        seen: true,
      }))

      fetch.jsonResponseOnce({...entry2, seen: true})
      await pressArrowRight()

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title2')
      expect(fetch.mostRecent().url).toEqual(entry2Url)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({
        seen: true,
      }))
    })

    it('should focus last entry when button clicked', async () => {
      await renderComponent()
      fetch.resetMocks()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await clickButtonNext()

      fetch.jsonResponseOnce({...entry2, seen: true})
      await clickButtonNext()
      await clickButtonNext()

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title2')
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

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title2')
      expect(fetch.requestCount()).toEqual(2)
    })
  })

  describe('previous entry', () => {

    it('initially should not focus entry when button clicked', async () => {
      await renderComponent()
      fetch.resetMocks()

      await clickButtonPrevious()

      expect(screen.queryByRole(roleEntryInFocus)).not.toBeInTheDocument()
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

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title1')
      expect(fetch.mostRecent().url).toEqual(entry2Url)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({
        seen: true,
      }))
    })

    it('should focus and update entry when hotkey clicked', async () => {
      await renderComponent()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressArrowRight()
      await pressArrowLeft()

      expect(screen.getByRole(roleEntryInFocus)).toHaveTextContent('title1')
      expect(fetch.mostRecent().url).toEqual(entry2Url)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({
        seen: true,
      }))
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

      expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntries1)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({seen: false}))

      fetch.jsonResponseOnce({...entry1, seen: true})
      await pressEscape()

      expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntries1)
      expect(fetch.mostRecent().method).toEqual('PATCH')
      expect(fetch.mostRecent().body).toEqual(JSON.stringify({seen: true}))
    })
  })

  it('should load next page', async () => {
    await renderComponent()

    fetch.jsonResponse({content: [{...entry3}, {...entry4}]})
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
    fireEvent.click(screen.getByRole(roleDialogErrorMessage))
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

    expect(fetch.mostRecent().url).toEqual('views/NavigationView')
    expect(fetch.mostRecent().method).toEqual('GET')
    expect(fetch.nthRequest(2).url).toEqual(api2SubscriptionEntriesFeedTagEqualA)
    expect(fetch.nthRequest(2).method).toEqual('GET')
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
    expect(screen.queryByRole('focus')).not.toBeInTheDocument()
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
    expect(fetch.mostRecent().url).toEqual('views/NavigationView')
    expect(fetch.mostRecent().method).toEqual('GET')
    expect(fetch.nthRequest(2).url).toEqual(api2SubscriptionEntriesFeedTagEqualA)
    expect(fetch.nthRequest(2).method).toEqual('GET')
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

    expect(screen.queryByRole(roleEntryInFocus)).toHaveTextContent('title1')
  })

  it('should render entries', async () => {
    await renderComponent()

    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title1')).toHaveAttribute('href', 'expected origin1')
    expect(screen.queryByText('title1')).toHaveAttribute('target', '_blank')
    expect(screen.queryByText('title1')).toHaveAttribute('rel', noopenerNoreferrer)
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title2')).toHaveAttribute('href', 'expected origin2')
    expect(screen.queryByText('title2')).toHaveAttribute('target', '_blank')
    expect(screen.queryByText('title2')).toHaveAttribute('rel', noopenerNoreferrer)
  })

  it('should show an error message if entries could not be fetched', async () => {
    fetch.rejectResponse({data: expectedError})
    await renderComponent()

    expect(screen.getByRole(roleDialogErrorMessage)).toHaveTextContent(expectedError)
    fireEvent.click(screen.getByRole(roleDialogErrorMessage))
  })

  it('should toggle entry seen flag', async () => {
    await renderComponent()

    fetch.jsonResponse({...entry1, seen: true})
    await act(async () => fireEvent.click(screen.getAllByRole(roleFlagAsSeen)[0]))

    expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntries1)
    expect(fetch.mostRecent().method).toEqual('PATCH')
    expect(fetch.mostRecent().body).toEqual(JSON.stringify({seen: true}))

    fetch.jsonResponse({...entry1, seen: false})
    await act(async () => fireEvent.click(screen.getAllByRole('flag-as-unseen')[0]))

    expect(fetch.mostRecent().url).toEqual(api2SubscriptionEntries1)
    expect(fetch.mostRecent().method).toEqual('PATCH')
    expect(fetch.mostRecent().body).toEqual(JSON.stringify({seen: false}))
  })

  it('should show error messages if read flag could not be set for multiple entries', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getAllByRole(roleFlagAsSeen)[0]))
    fetch.rejectResponse({data: expectedError})
    await act(async () => fireEvent.click(screen.getAllByRole(roleFlagAsSeen)[1]))

    expect(screen.getAllByRole(roleDialogErrorMessage)[0]).toHaveTextContent(expectedError)
    expect(screen.getAllByRole(roleDialogErrorMessage)[1]).toHaveTextContent(expectedError)
  })

  it('should show error messages if read flag could not be toggled for multiple entries', async () => {
    await renderComponent()

    fetch.rejectResponse({data: expectedError})
    await clickButtonNext()
    fetch.rejectResponse({data: expectedError})
    await pressEscape()
    fetch.rejectResponse({data: expectedError})
    await pressEscape()

    expect(screen.getAllByRole(roleDialogErrorMessage)[0]).toHaveTextContent(expectedError)
    expect(screen.getAllByRole(roleDialogErrorMessage)[1]).toHaveTextContent(expectedError)
  })

  it('should refresh entries if "showUnseenEntries" changed', async () => {
    await renderComponent()
    fetch.resetMocks()

    fetch.jsonResponse({
      content: [{...entry3}, {...entry4}]
    })

    await act(async () => fireEvent.click(screen.getByTestId('toggle-unseen')))

    expect(fetch.mostRecent().url).toEqual('api/2/subscriptionEntries?feedTagEqual=a&seenEqual=false')
    expect(fetch.mostRecent().method).toEqual('GET')

    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
    expect(screen.queryByText('title4')).toBeInTheDocument()
  })

  it('should fetch all entries if "seenEqual" is set to "*"', async () => {
    history.pushState(null, null, '#!/app/entries?seenEqual=*&entryTagEqual=a')
    await renderComponent()

    expect(fetch.mostRecent().url).toEqual('api/2/subscriptionEntries?entryTagEqual=a')
    expect(fetch.mostRecent().method).toEqual('GET')
  })

  it('should render entry contents', async () => {
    await renderComponent()

    expect(screen.getByText(entry1.content)).toHaveTextContent(expectedContent1)
    expect(screen.getByText(entry2.content)).toHaveTextContent('expected content2')
  })

  it('should not render entry contents if "showEntryDetails" setting is set to false', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId(testIdToggleDetails)))

    expect(screen.queryByText(entry1.content)).not.toBeInTheDocument()
    expect(screen.queryByText(entry2.content)).not.toBeInTheDocument()
  })

  it('should render entry1 content if "showEntryDetails" setting is set to false and details toggle clicked', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId(testIdToggleDetails)))
    await act(async () => fireEvent.click(screen.getAllByRole(roleMoreDetails)[0]))

    expect(screen.getByText(entry1.content)).toHaveTextContent(expectedContent1)
    expect(screen.queryByText(entry2.content)).not.toBeInTheDocument()
  })

  it('should hide entry1 content if "showEntryDetails" setting is set to false and details toggle clicked twice', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId(testIdToggleDetails)))
    await act(async () => fireEvent.click(screen.getAllByRole(roleMoreDetails)[0]))
    await act(async () => fireEvent.click(screen.getAllByRole('less-details')[0]))

    expect(screen.queryByText(entry1.content)).not.toBeInTheDocument()
    expect(screen.queryByText(entry2.content)).not.toBeInTheDocument()
  })

  it('should not render more toggle if "showEntryDetails" setting is set to false', async () => {
    await renderComponent()
    await act(async () => fireEvent.click(screen.getByTestId(testIdToggleDetails)))

    expect(screen.queryAllByRole('more-details').length).toEqual(2)
  })

  it('should not render more toggle if "showEntryDetails" setting is set to true', async () => {
    await renderComponent()

    expect(screen.queryAllByRole('less-details').length).toEqual(0)
    expect(screen.queryAllByRole('more-details').length).toEqual(0)
  })

  it('should render entry title', async () => {
    await renderComponent()

    expect(screen.getByText(entry1.title)).toHaveTextContent('title1')
    expect(screen.getByText(entry2.title)).toHaveTextContent('title2')
  })

  it('should open entry url in new window safely', async () => {
    await renderComponent()

    expect(screen.getByText(entry1.title)).toHaveAttribute('href', entry1.origin)
    expect(screen.getByText(entry1.title)).toHaveAttribute('rel', noopenerNoreferrer)
    expect(screen.getByText(entry1.title)).toHaveAttribute('target', '_blank')
    expect(screen.getByText(entry2.title)).toHaveAttribute('href', entry2.origin)
    expect(screen.getByText(entry2.title)).toHaveAttribute('rel', noopenerNoreferrer)
    expect(screen.getByText(entry2.title)).toHaveAttribute('target', '_blank')
  })

  it('should render entry feedTag and feedTagColor', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_614_453_487_714)
    fetch.resetMocks()
    fetch.jsonResponse({
      content: [{
        ...entry1,
        feedTag: expectedTag,
        feedTagColor: '#555555'
      }]
    })
    await renderComponent()

    expect(screen.getByText('13 hours ago on expected feedTitle1')).toBeInTheDocument()
    expect(screen.getByRole(roleFeedBadge)).toHaveTextContent(expectedTag)
    expect(screen.getByRole(roleFeedBadge)).toHaveTextContent(expectedTag)
    expect(screen.getByRole(roleFeedBadge)).toHaveStyle('--red: 85; --green: 85; --blue: 85;')
  })

  it('should fetch automatically next entries if last entry becomes visible', async () => {
    fetch.resetMocks()
    fetch.jsonResponse({content: [{...entry1}], nextPage: {uuid: 2}})
    await renderComponent()

    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()

    fetch.jsonResponse({content: [{...entry2}]})
    await act(async () => mockAllIsIntersecting(true))

    expect(fetch.mostRecent().url).toEqual('api/2/subscriptionEntries?uuid=2')
    expect(fetch.mostRecent().method).toEqual('GET')

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

    expect(screen.getByRole(roleEntryInFocus).scrollIntoView).toHaveBeenCalled()
  })

  it('should scroll entry into view if hotkey pressed', async () => {
    await renderComponent()
    await pressArrowRight()

    expect(screen.getByRole(roleEntryInFocus).scrollIntoView).toHaveBeenCalled()
  })
})
