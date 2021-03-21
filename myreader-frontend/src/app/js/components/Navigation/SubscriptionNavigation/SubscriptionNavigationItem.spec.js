import React from 'react'
import {Router} from 'react-router'
import {createMemoryHistory} from 'history'
import {render, screen, fireEvent} from '@testing-library/react'
import {SubscriptionNavigationItem} from './SubscriptionNavigationItem'

const itemTitle = 'itemTitle'

describe('SubscriptionNavigationItem', () => {

  let history, props, subscriptions1, subscriptions2

  const renderComponent = () => {
    return render(
      <Router history={history}>
        <SubscriptionNavigationItem {...props} />
      </Router>
    )
  }

  beforeEach(() => {
    history = createMemoryHistory()

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

  it('should render item', () => {
    renderComponent()

    expect(screen.getByText('itemTitle')).toBeInTheDocument()
    expect(screen.getByRole('badge')).toHaveTextContent('2')
  })

  it('should navigate if item clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByText(itemTitle))

    expect(history.action).toEqual('PUSH')
    expect(history.location.pathname).toEqual('/app/entries')
    expect(history.location.search).toEqual('?feedTagEqual=tag&feedUuidEqual=uuid')
  })

  it('should trigger prop function "onClick" when navigation item clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByText(itemTitle))

    expect(props.onClick).toHaveBeenCalled()
  })

  it('should flag navigation item as selected when "feedUuidEqual" and "feedTagEqual" is not equal to item uuid and tag', () => {
    renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })

  it('should not flag navigation item as selected when "feedTagEqual" is not equal to item tag', () => {
    props.location = {
      search: `?feedUuidEqual=${props.item.uuid}`
    }
    renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })

  it('should not flag navigation item as selected when "feedUuidEqual" is not equal to item uuid', () => {
    props.location = {
      search: `?feedTagEqual=${props.item.tag}`
    }
    renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
  })

  it('should flag navigation item as selected when "feedUuidEqual" and "queryEqual" is equal to item uuid and tag', () => {
    history.push({
      search: `?feedTagEqual=${props.item.tag}&feedUuidEqual=${props.item.uuid}`,
    })
    renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/itemTitle/)
  })

  it('should flag navigation item as selected when "feedTagEqual" is equal to item tag and uuid is set to null', () => {
    props = {
      ...props,
      item: {
        ...props.item,
        tag: 'tag',
        uuid: null,
      },
    }
    history.push({
      search: `?feedTagEqual=${props.item.tag}`,
    })
    renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/itemTitle/)
  })

  it('should flag navigation item as selected when "feedTagEqual" and "feedUuidEqual" are not set and uuid and tag are set to null', () => {
    props = {
      ...props,
      item: {
        ...props.item,
        tag: null,
        uuid: null,
      },
    }
    renderComponent()

    expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/itemTitle/)
  })

  describe('with feedTag set', () => {

    beforeEach(() => {
      history.push({
        search: `?feedTagEqual=${props.item.tag}`,
      })
    })

    it('should not render navigation subscriptions when "feedTagEqual" is not equal to item tag', () => {
      history.push({
        search: '',
      })
      renderComponent()

      expect(screen.queryByText('subscription 1')).not.toBeInTheDocument()
      expect(screen.queryByText('subscription 2')).not.toBeInTheDocument()
    })

    it('should not render navigation subscriptions when prop "item.subscriptions" is undefined', () => {
      props.item.subscriptions = null
      renderComponent()

      expect(screen.queryByText('subscription 1')).not.toBeInTheDocument()
      expect(screen.queryByText('subscription 2')).not.toBeInTheDocument()
    })

    it('should render navigation subscriptions when "feedTagEqual" is equal to item tag', () => {
      renderComponent()

      expect(screen.queryByText('subscription 1')).toBeInTheDocument()
      expect(screen.queryByText('subscription 2')).toBeInTheDocument()
    })

    it('should pass expected prop "to" with feedUuidEqual set', () => {
      props.item.tag = null
      renderComponent()

      fireEvent.click(screen.getByText(itemTitle))

      expect(history.action).toEqual('PUSH')
      expect(history.location.pathname).toEqual('/app/entries')
      expect(history.location.search).toEqual('?feedUuidEqual=uuid')
    })

    it('should pass expected prop "to" with feedTagEqual set', () => {
      props.item.uuid = ''
      renderComponent()

      fireEvent.click(screen.getByText(itemTitle))

      expect(history.action).toEqual('PUSH')
      expect(history.location.pathname).toEqual('/app/entries')
      expect(history.location.search).toEqual('?feedTagEqual=tag')
    })

    it('should pass expected prop "to" without search value set', () => {
      props.item.uuid = ''
      props.item.tag = null
      renderComponent()

      fireEvent.click(screen.getByText(itemTitle))

      expect(history.action).toEqual('PUSH')
      expect(history.location.pathname).toEqual('/app/entries')
      expect(history.location.search).toEqual('')
    })

    it('should pass expected props to navigation subscription items', () => {
      renderComponent()

      fireEvent.click(screen.getByText('subscription 1'))

      expect(history.action).toEqual('PUSH')
      expect(history.location.pathname).toEqual('/app/entries')
      expect(history.location.search).toEqual('?feedTagEqual=tag&feedUuidEqual=uuid1')

      fireEvent.click(screen.getByText('subscription 2'))

      expect(history.action).toEqual('PUSH')
      expect(history.location.pathname).toEqual('/app/entries')
      expect(history.location.search).toEqual('?feedTagEqual=tag&feedUuidEqual=uuid2')
    })

    it('should not flag any navigation subscription item as selected when "feedUuidEqual" is not equal to a subscription uuid', () => {
      renderComponent()

      expect(screen.queryByRole('selected-navigation-item')).not.toBeInTheDocument()
    })

    it('should flag first navigation subscription item as selected when "feedUuidEqual" is equal to first subscription uuid', () => {
      history.push({
        search: `?feedTagEqual=${props.item.tag}&feedUuidEqual=${props.item.subscriptions[0].uuid}`,
      })
      renderComponent()

      expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/subscription 1/)
    })

    it('should flag second navigation subscription item as selected when "feedUuidEqual" is equal to second subscription uuid', () => {
      history.push({
        search: `?feedTagEqual=${props.item.tag}&feedUuidEqual=${props.item.subscriptions[1].uuid}`,
      })
      renderComponent()

      expect(screen.queryByRole('selected-navigation-item')).toHaveTextContent(/subscription 2/)
    })

    it('should trigger prop function "onClick" when first subscription navigation item clicked', () => {
      renderComponent()
      fireEvent.click(screen.getByText('subscription 1'))

      expect(props.onClick).toHaveBeenCalled()
    })

    it('should trigger prop function "onClick" when second subscription navigation item clicked', () => {
      renderComponent()
      fireEvent.click(screen.getByText('subscription 2'))

      expect(props.onClick).toHaveBeenCalled()
    })
  })
})
