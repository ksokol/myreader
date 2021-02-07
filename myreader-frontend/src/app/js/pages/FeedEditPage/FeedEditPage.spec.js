import React from 'react'
import {render, screen, act} from '@testing-library/react'
import {Router, Route, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {FeedEditPage} from './FeedEditPage'

jest.unmock('react-router')
jest.unmock('react-router-dom')

const feed = {uuid: '1', title: 'expected title', url: 'http:/example.com'}
describe('FeedEditPage', () => {

  let history

  const renderComponent = async () => {
    await act(async () => {
      render(
        <Router history={history}>
          <Switch>
            <Route
              exact={true}
              path='/:uuid'
              component={FeedEditPage}
            />
          </Switch>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()
    history.push({pathname: '1'})

    fetch.jsonResponseOnce(feed)
  })

  it('should not render feed edit form if feed is still loading', async () => {
    fetch.resetMocks()
    fetch.responsePending()
    await renderComponent()

    expect(screen.queryByRole('input')).not.toBeInTheDocument()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(screen.queryByRole('validations')).not.toBeInTheDocument()
  })

  it('should fetch feed for given uuid', async () => {
    fetch.resetMocks()
    fetch.responsePending()
    await renderComponent()

    expect(fetch.mostRecent()).toMatchGetRequest({
      url: 'api/2/feeds/1'
    })
  })

  it('should render feed edit form', async () => {
    await renderComponent()

    expect(screen.queryByDisplayValue('expected title')).toBeInTheDocument()
    expect(screen.queryByDisplayValue('http:/example.com')).toBeInTheDocument()
  })
})
