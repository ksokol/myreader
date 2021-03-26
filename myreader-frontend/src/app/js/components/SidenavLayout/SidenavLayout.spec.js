import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {SidenavLayout} from './SidenavLayout'
import {SubscriptionProvider} from '../../contexts/subscription/SubscriptionProvider'

describe('SidenavLayout', () => {

  let history, capturedListener

  const renderComponent = async () => {
    await act(async () => {
      await render(
        <Router history={history}>
          <SubscriptionProvider>
            <SidenavLayout>expected child</SidenavLayout>
          </SubscriptionProvider>
        </Router>
      )
    })
  }

  beforeEach(() => {
    history = createMemoryHistory()
    capturedListener = []

    window.matchMedia = media => ({
      media,
      addEventListener: (type, fn) => capturedListener.push(() => {
        fn({matches: true, media})
      }),
      removeEventListener: () => null
    })

    fetch.jsonResponse({
      content: []
    })
  })


  it('should render children', async () => {
    await renderComponent()
    act(() => capturedListener[0]())

    expect(screen.getByText('expected child')).toBeInTheDocument()
  })

  it('should animate navigation when not on desktop', async () => {
    await renderComponent()
    act(() => capturedListener[0]())

    expect(screen.getByRole('navigation')).toHaveClass('my-sidenav-layout__nav--animate')

    act(() => capturedListener[1]())
    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--animate')
  })

  it('should toggle navigation when hamburger menu and navigation clicked', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')

    fireEvent.click(screen.getByRole('navigation-menu-button'))
    expect(screen.getByRole('navigation')).toHaveClass('my-sidenav-layout__nav--open')
  })

  it('should not show hamburger menu on phones and tablets', async () => {
    await renderComponent()
    await act(async () => await capturedListener[1]())

    expect(screen.queryByRole('navigation-menu-button')).not.toBeInTheDocument()

    await act(async () => await capturedListener[0]())
    expect(screen.queryByRole('navigation-menu-button')).toBeInTheDocument()
  })

  it('should toggle navigation when hamburger menu and backdrop clicked', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('navigation-menu-button'))
    expect(screen.getByRole('navigation')).toHaveClass('my-sidenav-layout__nav--open')
    fireEvent.click(screen.getByRole('backdrop'))

    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')
    await waitFor(() => expect(screen.queryByRole('backdrop')).not.toBeInTheDocument())
  })

  it('should set prop "maybeVisible" to false on backdrop component when navigation clicked', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    fireEvent.click(screen.getByRole('navigation-menu-button'))
    fireEvent.click(screen.getByText('all'))

    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')
    await waitFor(() => expect(screen.queryByRole('backdrop')).not.toBeInTheDocument())
  })

  it('should not slide in navigation on desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')

    await act(async () => await capturedListener[1]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')
  })

  it('should pin navigation when on desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    fireEvent.click(screen.getByRole('navigation-menu-button'))

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveClass('my-sidenav-layout__nav--open')

    await act(async () => await capturedListener[1]())

    await waitFor(() => {
      expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
      expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')
    })
  })

  it('should slide in navigation when not on desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[1]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')

    await act(async () => await capturedListener[0]())
    fireEvent.click(screen.getByRole('navigation-menu-button'))

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveClass('my-sidenav-layout__nav--open')
  })

  it('should not show backdrop when navigation clicked and media breakpoint is set to desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[1]())

    fireEvent.click(screen.getByText('all'))

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass('my-sidenav-layout__nav--open')
  })
})
