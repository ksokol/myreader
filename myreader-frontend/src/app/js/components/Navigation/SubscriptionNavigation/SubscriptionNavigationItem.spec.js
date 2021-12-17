import {render, screen, fireEvent, act, waitFor} from '@testing-library/react'
import {SubscriptionNavigationItem} from './SubscriptionNavigationItem'
import {RouterProvider} from '../../../contexts/router'

const itemTitle = 'itemTitle'

const renderComponent = async (props) => {
  return await act(async () =>
    await render(
      <RouterProvider>
        <SubscriptionNavigationItem {...props} />
      </RouterProvider>
    )
  )
}

describe('SubscriptionNavigationItem', () => {

  let props, subscriptions1, subscriptions2

  beforeEach(() => {
    history.pushState(null, null, '#!/app/irrelevant')

    subscriptions1 = {title: 'subscription 1', uuid: 'uuid1', unseen: 1, tag: 'tag'}
    subscriptions2 = {title: 'subscription 2', uuid: 'uuid2', unseen: 0, tag: 'tag'}

    props = {
      item: {
        title: itemTitle,
        unseen: 2,
        tag: 'tag',
        uuid: 'uuid',
        subscriptions: [subscriptions1, subscriptions2]
      },
      onClick: jest.fn()
    }
  })

  it('should render item', async () => {
    await renderComponent(props)

    expect(screen.getByText('itemTitle')).toBeInTheDocument()
    expect(screen.getByRole('badge')).toHaveTextContent('2')
  })

  it('should navigate if item clicked', async () => {
    let currentHistoryLength = history.length
    await renderComponent(props)

    await act(async () => fireEvent.click(screen.getByText(itemTitle)))

    await waitFor(() => {
      expect(history.length).toBeGreaterThan(currentHistoryLength) // push
      expect(document.location.href).toMatch(/\/app\/entries\?feedTagEqual=tag&feedUuidEqual=uuid$/)
    })
  })

  it('should trigger prop function "onClick" when navigation item clicked', async () => {
    await renderComponent(props)
    fireEvent.click(screen.getByText(itemTitle))

    expect(props.onClick).toHaveBeenCalled()
  })

  it('should flag navigation item as selected when "feedUuidEqual" and "feedTagEqual" is not equal to item uuid and tag', async () => {
    await renderComponent(props)

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })

  it('should not flag navigation item as selected when "feedTagEqual" is not equal to item tag', async () => {
    props.location = {
      search: `?feedUuidEqual=${props.item.uuid}`
    }
    await renderComponent(props)

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })

  it('should not flag navigation item as selected when "feedUuidEqual" is not equal to item uuid', async () => {
    props.location = {
      search: `?feedTagEqual=${props.item.tag}`
    }
    await renderComponent(props)

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })

  it('should flag navigation item as selected when "feedUuidEqual" and "queryEqual" is equal to item uuid and tag', async () => {
    history.pushState(null, null, `#!/app/irrelevant?feedTagEqual=${props.item.tag}&feedUuidEqual=${props.item.uuid}`)
    await renderComponent(props)

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/itemTitle/)
  })

  it('should flag navigation item as selected when "feedTagEqual" is equal to item tag and uuid is set to null', async () => {
    props = {
      ...props,
      item: {
        ...props.item,
        tag: 'tag',
        uuid: null,
      },
    }
    history.pushState(null, null, `#!/app/irrelevant?feedTagEqual=${props.item.tag}`)
    await renderComponent(props)

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/itemTitle/)
  })

  it('should flag navigation item as selected when "feedTagEqual" and "feedUuidEqual" are not set and uuid and tag are set to null', async () => {
    props = {
      ...props,
      item: {
        ...props.item,
        tag: null,
        uuid: null,
      },
    }
    await renderComponent(props)

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/itemTitle/)
  })

  describe('with feedTag set', () => {

    beforeEach(() => {
      history.pushState(null, null, `#!/app/irrelevant?feedTagEqual=${props.item.tag}`)
    })

    it('should not render navigation subscriptions when "feedTagEqual" is not equal to item tag', async () => {
      history.pushState(null, null, '#!/app/irrelevant')
      await renderComponent(props)

      expect(screen.queryByText('subscription 1')).not.toBeInTheDocument()
      expect(screen.queryByText('subscription 2')).not.toBeInTheDocument()
    })

    it('should not render navigation subscriptions when prop "item.subscriptions" is undefined', async () => {
      props.item.subscriptions = null
      await renderComponent(props)

      expect(screen.queryByText('subscription 1')).not.toBeInTheDocument()
      expect(screen.queryByText('subscription 2')).not.toBeInTheDocument()
    })

    it('should render navigation subscriptions when "feedTagEqual" is equal to item tag', async () => {
      await renderComponent(props)

      expect(screen.queryByText('subscription 1')).toBeInTheDocument()
      expect(screen.queryByText('subscription 2')).toBeInTheDocument()
    })

    it('should pass expected prop "to" with feedUuidEqual set', async () => {
      const currentHistoryLength = history.length
      props.item.tag = null
      await renderComponent(props)

      fireEvent.click(screen.getByText(itemTitle))

      await waitFor(() => {
        expect(history.length).toBeGreaterThan(currentHistoryLength) // push
        expect(document.location.href).toMatch(/\/app\/entries\?feedUuidEqual=uuid$/)
      })
    })

    it('should pass expected prop "to" with feedTagEqual set', async () => {
      const currentHistoryLength = history.length
      props.item.uuid = ''
      await renderComponent(props)

      fireEvent.click(screen.getByText(itemTitle))

      await waitFor(() => {
        expect(history.length).toBeGreaterThan(currentHistoryLength) // push
        expect(document.location.href).toMatch(/\/app\/entries\?feedTagEqual=tag$/)
      })
    })

    it('should pass expected prop "to" without search value set', async () => {
      const currentHistoryLength = history.length
      props.item.uuid = ''
      props.item.tag = null
      await renderComponent(props)

      fireEvent.click(screen.getByText(itemTitle))

      await waitFor(() => {
        expect(history.length).toBeGreaterThan(currentHistoryLength) // push
        expect(document.location.href).toMatch(/\/app\/entries$/)
      })
    })

    it('should pass expected props to navigation subscription items', async () => {
      let currentHistoryLength = history.length
      await renderComponent(props)

      await act(async () => fireEvent.click(screen.getByText('subscription 1')))

      await waitFor(() => {
        expect(history.length).toBeGreaterThan(currentHistoryLength) // push
        expect(document.location.href).toMatch(/\/app\/entries\?feedTagEqual=tag&feedUuidEqual=uuid1$/)
      })
      currentHistoryLength = history.length

      await act(async () => fireEvent.click(screen.getByText('subscription 2')))
      await waitFor(() => {
        expect(history.length).toBeGreaterThan(currentHistoryLength) // push
        expect(document.location.href).toMatch(/\/app\/entries\?feedTagEqual=tag&feedUuidEqual=uuid2$/)
      })
    })

    it('should not flag any navigation subscription item as selected when "feedUuidEqual" is not equal to a subscription uuid', async () => {
      await renderComponent(props)

      expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
    })

    it('should flag first navigation subscription item as selected when "feedUuidEqual" is equal to first subscription uuid', async () => {
      history.pushState(null, null, `#!/app/irrelevant?feedTagEqual=${props.item.tag}&feedUuidEqual=${props.item.subscriptions[0].uuid}`)
      await renderComponent(props)

      expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/subscription 1/)
    })

    it('should flag second navigation subscription item as selected when "feedUuidEqual" is equal to second subscription uuid', async () => {
      history.pushState(null, null, `#!/app/irrelevant?feedTagEqual=${props.item.tag}&feedUuidEqual=${props.item.subscriptions[1].uuid}`)
      await renderComponent(props)

      expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/subscription 2/)
    })

    it('should trigger prop function "onClick" when first subscription navigation item clicked', async () => {
      await renderComponent(props)
      fireEvent.click(screen.getByText('subscription 1'))

      expect(props.onClick).toHaveBeenCalled()
    })

    it('should trigger prop function "onClick" when second subscription navigation item clicked', async () => {
      await renderComponent(props)
      fireEvent.click(screen.getByText('subscription 2'))

      expect(props.onClick).toHaveBeenCalled()
    })
  })
})
