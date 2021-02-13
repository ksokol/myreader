import React from 'react'
import {render,  screen} from '@testing-library/react'
import {AdminOverviewPage} from './AdminOverviewPage'

describe('AdminOverviewPage', () => {

  const renderComponent = () => {
    render(<AdminOverviewPage />)
  }

  it('should show version and commit id', async () => {
    document.head.dataset.buildVersion = 'expected version'
    document.head.dataset.buildCommitId = 'expected commit id'

    renderComponent()

    expect(screen.getByText('expected version')).toBeInTheDocument()
    expect(screen.getByText('expected commit id')).toBeInTheDocument()
  })
})
