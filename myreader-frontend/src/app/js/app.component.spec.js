import {componentMock, mockNgRedux, reactComponent} from './shared/test-utils'

class Page {

  constructor(el) {
    this.el = el
  }

  get backdrop() {
    return this.el.find('my-backdrop')[0]
  }

  get nav() {
    return this.el.find('nav')[0]
  }

  get someNavigationItem() {
    return this.el.find('nav').children()[0]
  }

  get hamburgerMenuIcon() {
    return this.el.find('header').children()[0]
  }
}

describe('src/app/js/app.component.spec.js', () => {

  let scope, ngReduxMock, page, menuButton

  const givenState = ({mediaBreakpoint = 'phone', sidenavSlideIn = true}) => {
    ngReduxMock.setState({common: {mediaBreakpoint, sidenavSlideIn}})
    scope.$digest()
  }

  beforeEach(() => {
    menuButton = reactComponent('IconButton')
    angular.mock.module(
      'myreader',
      mockNgRedux(),
      reactComponent('ContainerComponentBridge'),
      componentMock('myBackdrop'),
      componentMock('myNavigation'),
      menuButton
    )
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux


    const element = $compile('<my-app></my-app>')(scope)
    scope.$digest()

    page = new Page(element)
  }))

  it('should include backdrop component', () => {
    expect(page.backdrop).toBeDefined()
  })

  it('should slide in navigation on phones and tablets', () => {
    givenState({mediaBreakpoint: 'phone'})
    expect(page.nav.classList).toContain('app__nav--animate')

    givenState({mediaBreakpoint: 'tablet'})
    expect(page.nav.classList).toContain('app__nav--animate')

    givenState({mediaBreakpoint: 'desktop'})
    expect(page.nav.classList).not.toContain('app__nav--animate')
  })

  it('should toggle navigation when state changes', () => {
    givenState({sidenavSlideIn: true})
    expect(page.nav.classList).toContain('app__nav--open')

    givenState({sidenavSlideIn: false})
    expect(page.nav.classList).not.toContain('app__nav--open')
  })

  it('should show hamburger menu on phones and tablets', () => {
    givenState({mediaBreakpoint: 'phone'})
    expect(page.hamburgerMenuIcon).toBeDefined()

    givenState({mediaBreakpoint: 'tablet'})
    expect(page.hamburgerMenuIcon).toBeDefined()

    givenState({mediaBreakpoint: 'desktop'})
    expect(page.hamburgerMenuIcon).not.toBeDefined()
  })

  it('should toggle navigation when hamburger menu icon clicked', () => {
    menuButton.bindings.onClick()

    expect(ngReduxMock.getActionTypes()).toEqual(['TOGGLE_SIDENAV'])
  })

  it('should toggle navigation when some navigation item clicked', () => {
    page.someNavigationItem.click()

    expect(ngReduxMock.getActionTypes()).toEqual(['TOGGLE_SIDENAV'])
  })
})
