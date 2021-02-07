import React from 'react'
import {render, waitFor, screen} from '@testing-library/react'
import {AdminOverviewPage} from './AdminOverviewPage'

describe('AdminOverviewPage', () => {

  const renderComponent = () => {
    render(<AdminOverviewPage />)
  }

  it('should pass applicationInfo to admin overview component when adminApi.fetchApplicationInfo succeeded', async () => {
    const spy = jest.spyOn(Date, 'now')
    spy.mockReturnValue(new Date('2020-12-06T16:30:00.000Z').getTime())

    fetch.jsonResponse({
      git: {
        branch: 'expectedBranch',
        commit: {
          id: 'expectedCommitId',
        },
      },
      build: {
        version: 'expectedVersion',
        time: '2020-12-05T12:30:00.000Z',
      }
    })
    renderComponent()

    await waitFor(() => {
      expect(screen.queryByTestId('application-info')).toHaveTextContent('expectedBranch')
      expect(screen.queryByTestId('application-info')).toHaveTextContent('expectedCommitId')
      expect(screen.queryByTestId('application-info')).toHaveTextContent('expectedVersion')
      expect(screen.queryByTestId('application-info')).toHaveTextContent('1 day ago')
    })
  })

  it('should not render application info component when prop "applicationInfo" is undefined', async () => {
    fetch.responsePending()
    renderComponent()

    await waitFor(() => expect(screen.queryByRole('application-info')).not.toBeInTheDocument())
  })

  it('should not render application info component when prop "applicationInfo" is an empty object', async () => {
    fetch.responsePending({})
    renderComponent()

    await waitFor(() => expect(screen.queryByRole('application-info')).not.toBeInTheDocument())
  })

  it('should trigger toast when adminApi.fetchApplicationInfo failed', async () => {
    fetch.rejectResponse()
    renderComponent()

    await waitFor(() => expect(screen.getByRole('dialog-info-message')).toHaveTextContent('Application info is missing'))
  })
})
