import {useContext, useEffect} from 'react'
import {render, fireEvent, waitFor, screen, act} from '@testing-library/react'
import {SubscriptionListPage} from './SubscriptionListPage'
import {NavigationProvider} from '../../contexts/navigation/NavigationProvider'
import NavigationContext from '../../contexts/navigation/NavigationContext'
import {RouterProvider} from '../../contexts/router'

function TestComponent({children}) {
  const {fetchData} = useContext(NavigationContext)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return children
}

const renderComponent = async () => {
  await act(async () =>
    await render(
      <>
        <div id='portal-header' />
        <RouterProvider>
          <NavigationProvider>
            <TestComponent>
              <SubscriptionListPage />
            </TestComponent>
          </NavigationProvider>
        </RouterProvider>
      </>
    )
  )
}

describe('SubscriptionListPage', () => {

  beforeEach(() => {
    history.pushState(null, null, '#!/app/subscriptions')

    fetch.jsonResponseOnce({
      subscriptions: [
        {uuid: '1', title: 'title1', createdAt: '2021-02-27T06:48:05.087+01:00', fetchErrorCount: 42},
        {uuid: '2', title: 'title2', createdAt: '2021-02-27T07:48:05.087+01:00', fetchErrorCount: 0},
      ]
    })
  })

  it('should present given subscriptions', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_614_453_487_714)
    await renderComponent()

    expect(fetch.mostRecent().url).toEqual('views/NavigationFragment')
    expect(fetch.mostRecent().method).toEqual('GET')
    await waitFor(() => {
      expect(screen.queryByText('title1')).toBeInTheDocument()
      expect(screen.queryByText('13 hours ago')).toBeInTheDocument()
      expect(screen.queryByText('title2')).toBeInTheDocument()
      expect(screen.queryByText('12 hours ago')).toBeInTheDocument()
    })
  })

  it('should navigate to subscription', async () => {
    await renderComponent()
    const currentHistoryLength = history.length

    await waitFor(async () => fireEvent.click(screen.queryByText('title1')))

    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength + 1) // push
      expect(document.location.href).toMatch(/\/app\/subscription\?uuid=1$/)
    })
  })

  it('should filter subscriptions by title title1', async () => {
    await renderComponent()
    const currentHistoryLength = history.length

    fireEvent.change(screen.getByRole('search'), {target: {value: 'title1'}})

    expect(screen.getByRole('search')).toHaveValue('title1')
    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/subscriptions\?q=title1$/)
    })
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })

  it('should filter subscriptions by title title2', async () => {
    await renderComponent()
    const currentHistoryLength = history.length

    fireEvent.change(screen.getByRole('search'), {target: {value: 'title2'}})

    expect(screen.getByRole('search')).toHaveValue('title2')
    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/subscriptions\?q=title2$/)
    })
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
  })

  it('should filter subscriptions by title TITLE1', async () => {
    await renderComponent()
    const currentHistoryLength = history.length

    fireEvent.change(screen.getByRole('search'), {target: {value: 'TITLE1'}})

    expect(screen.getByRole('search')).toHaveValue('TITLE1')
    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/subscriptions\?q=TITLE1$/)
    })
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })

  it('should filter subscriptions by title titl', async () => {
    await renderComponent()
    const currentHistoryLength = history.length

    fireEvent.change(screen.getByRole('search'), {target: {value: 'titl'}})

    expect(screen.getByRole('search')).toHaveValue('titl')
    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/subscriptions\?q=titl$/)
    })
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
  })

  it('should filter subscriptions by title other', async () => {
    await renderComponent()
    const currentHistoryLength = history.length

    fireEvent.change(screen.getByRole('search'), {target: {value: 'other'}})

    expect(screen.getByRole('search')).toHaveValue('other')
    await waitFor(() => {
      expect(history.length).toEqual(currentHistoryLength) // replace
      expect(document.location.href).toMatch(/\/app\/subscriptions\?q=other$/)
    })
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })

  it('should reload subscription when refresh icon button clicked', async () => {
    await renderComponent()

    fetch.jsonResponseOnce({
      subscriptions: [
        {uuid: '2', title: 'title2', createdAt: 'createdAt2'},
        {uuid: '3', title: 'title3', createdAt: 'createdAt3'},
      ],
    })

    await act(async () => fireEvent.click(screen.getByRole('refresh')))

    expect(fetch.mostRecent().url).toEqual('views/NavigationFragment')
    expect(fetch.mostRecent().method).toEqual('GET')
    expect(screen.queryByText('title1')).not.toBeInTheDocument()
    expect(screen.queryByText('title2')).toBeInTheDocument()
    expect(screen.queryByText('title3')).toBeInTheDocument()
  })

  it('should show filtered subscriptions if search query is set', async () => {
    history.pushState(null, null, '#!/app/subscriptions?q=title1')
    await renderComponent()

    expect(screen.getByRole('search')).toHaveValue('title1')
    expect(screen.queryByText('title1')).toBeInTheDocument()
    expect(screen.queryByText('title2')).not.toBeInTheDocument()
  })
})
