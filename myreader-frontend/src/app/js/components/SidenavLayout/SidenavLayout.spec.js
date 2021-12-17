import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {SidenavLayout} from './SidenavLayout'
import {NavigationProvider} from '../../contexts/navigation/NavigationProvider'
import {RouterProvider} from '../../contexts/router'

const sidenavLayoutNavOpenClass = 'my-sidenav-layout__nav--open'
const navigationMenuButtonClass = 'navigation-menu-button'

const renderComponent = async () => {
  await act(async () =>
    await render(
      <RouterProvider>
        <NavigationProvider>
          <SidenavLayout>expected child</SidenavLayout>
        </NavigationProvider>
      </RouterProvider>
    )
  )
}

describe('SidenavLayout', () => {

  let capturedListener

  beforeEach(() => {
    history.pushState(null, null, '#!/app/irrelevant')
    capturedListener = []

    window.matchMedia = media => ({
      media,
      addEventListener: (type, fn) => capturedListener.push(() => {
        fn({matches: true, media})
      }),
      removeEventListener: () => null
    })

    fetch.jsonResponse({
      subscriptions: []
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

    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)

    fireEvent.click(screen.getByRole(navigationMenuButtonClass))
    expect(screen.getByRole('navigation')).toHaveClass(sidenavLayoutNavOpenClass)
  })

  it('should not show hamburger menu on phones and tablets', async () => {
    await renderComponent()
    await act(async () => await capturedListener[1]())

    expect(screen.queryByRole(navigationMenuButtonClass)).not.toBeInTheDocument()

    await act(async () => await capturedListener[0]())
    expect(screen.queryByRole(navigationMenuButtonClass)).toBeInTheDocument()
  })

  it('should toggle navigation when hamburger menu and backdrop clicked', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole(navigationMenuButtonClass))
    expect(screen.getByRole('navigation')).toHaveClass(sidenavLayoutNavOpenClass)
    fireEvent.click(screen.getByRole('backdrop'))

    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)
    await waitFor(() => expect(screen.queryByRole('backdrop')).not.toBeInTheDocument())
  })

  it('should set prop "maybeVisible" to false on backdrop component when navigation clicked', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    fireEvent.click(screen.getByRole(navigationMenuButtonClass))
    fireEvent.click(screen.getByText('all'))

    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)
    await waitFor(() => expect(screen.queryByRole('backdrop')).not.toBeInTheDocument())
  })

  it('should not slide in navigation on desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)

    await act(async () => await capturedListener[1]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)
  })

  it('should pin navigation when on desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[0]())

    fireEvent.click(screen.getByRole(navigationMenuButtonClass))

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveClass(sidenavLayoutNavOpenClass)

    await act(async () => await capturedListener[1]())

    await waitFor(() => {
      expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
      expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)
    })
  })

  it('should slide in navigation when not on desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[1]())

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)

    await act(async () => await capturedListener[0]())
    fireEvent.click(screen.getByRole(navigationMenuButtonClass))

    expect(screen.queryByRole('backdrop')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toHaveClass(sidenavLayoutNavOpenClass)
  })

  it('should not show backdrop when navigation clicked and media breakpoint is set to desktop', async () => {
    await renderComponent()
    await act(async () => await capturedListener[1]())

    fireEvent.click(screen.getByText('all'))

    expect(screen.queryByRole('backdrop')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).not.toHaveClass(sidenavLayoutNavOpenClass)
  })
})
