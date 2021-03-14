import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {BookmarkNavigationItem} from './BookmarkNavigationItem'
import {BOOKMARK_PAGE_PATH} from '../../../constants'

jest.unmock('react-router')
jest.unmock('react-router-dom')

describe('BookmarkNavigationItem', () => {

  let props, history

  const renderComponent = async () => {
    return await act(async () => {
      return await render(
        <Router history={history}>
          <BookmarkNavigationItem {...props} />
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()
    history.push(BOOKMARK_PAGE_PATH)

    props = {
      onClick: jest.fn()
    }

    fetch.jsonResponse(['tag1', 'tag2'])
  })

  it('should render items if on bookmark route', async () => {
    await renderComponent()

    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  it('should not render items if on other route', async () => {
    history.push('/other')
    await renderComponent()

    expect(screen.queryByText('tag1')).not.toBeInTheDocument()
    expect(screen.queryByText('tag2')).not.toBeInTheDocument()
  })

  it('should fetch tags from endpoint if on bookmark route', async () => {
    await renderComponent()

    expect(fetch.requestCount()).toEqual(1)
    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/subscriptionEntries/availableTags'
    })
  })

  it('should not fetch tags from endpoint if on other route', async () => {
    history.push('/other')
    await renderComponent()

    expect(fetch.requestCount()).toEqual(0)
  })

  it('should navigate to bookmark route', async () => {
    await renderComponent()

    await act(async () => await fireEvent.click(screen.getByText('Bookmarks')))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/bookmark')
    expect(history.location.search).toEqual('')
    expect(props.onClick).not.toHaveBeenCalled()
  })

  it('should navigate to route if item clicked', async () => {
    await renderComponent()

    await act(async () => await fireEvent.click(screen.getByText('tag1')))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/bookmark')
    expect(history.location.search).toEqual('?entryTagEqual=tag1')
    expect(props.onClick).toHaveBeenCalled()
  })

  it('should show error message if tags could not be fetched', async () => {
    fetch.rejectResponse('expected error')
    await renderComponent()

    expect(screen.getByRole('dialog-error-message')).toHaveTextContent('expected error')
  })

  it('should select item', async () => {
    history.push({
      search: '?entryTagEqual=tag1'
    })
    await renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent('tag1')
  })

  it('should not select item', async () => {
    await renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })
})
