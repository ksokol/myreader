import {componentMock, mockNgRedux, reactComponent, connectedReactComponent} from '../shared/test-utils'

describe('src/app/js/bookmark/bookmark.component.spec.js', () => {

  let scope, ngReduxMock, element, entryList, chips

  describe('', () => {

    beforeEach(() => {
      entryList = connectedReactComponent('ContainerComponentBridge')
      chips = reactComponent('Chips')
      angular.mock.module('myreader', entryList, mockNgRedux(), chips)
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
      ngReduxMock = $ngRedux
      scope = $rootScope.$new(true)

      ngReduxMock.setState({
          router: {query: {entryTagEqual: 'tag2'}},
          entry: {tags: ['tag1', 'tag2']}
      })

      element = $compile('<my-bookmark></my-bookmark>')(scope)
      scope.$digest()
    }))

    it('should pass properties to Chips component', () => {
      expect(chips.bindings.values).toEqual(['tag1', 'tag2'])
      expect(chips.bindings.selected).toEqual('tag2')
    })

    it('should update url with selected entry tag', () => {
      chips.bindings.onSelect('tag1')

      expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
      expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {entryTagEqual: 'tag1'}})
    })

    it('should contain EntryListComponent', () => {
      expect(element[0].querySelector('react-component[props="$ctrl.entryListContainerProps"]')).not.toBeNull()
    })

    it('should return key for given value in prop "values" when prop "keyFn" function called', () => {
      expect(chips.bindings.keyFn(chips.bindings.values[0])).toEqual('tag1')
    })

    it('should render entry tags', () => {
      expect(chips.bindings.renderItem(chips.bindings.values)).toEqual(chips.bindings.values)
    })
  })

  describe('', () => {

    let listPage

    beforeEach(() => {
      entryList = connectedReactComponent('ContainerComponentBridge')
      listPage = componentMock('myListPage')
      angular.mock.module('myreader', entryList, listPage, mockNgRedux())
    })

    beforeEach(inject(($rootScope, $compile, $ngRedux) => {
      ngReduxMock = $ngRedux
      scope = $rootScope.$new(true)

      ngReduxMock.setState({entry: {tags: []}})

      element = $compile('<my-bookmark></my-bookmark>')(scope)
      scope.$digest()
    }))

    it('should update url when search executed', () => {
      listPage.bindings.myOnSearch({params: {q: 'b'}})
      scope.$digest()

      expect(ngReduxMock.getActionTypes()).toEqual(['ROUTE_CHANGED'])
      expect(ngReduxMock.getActions()[0]).toContainActionData({route: ['app', 'bookmarks'], query: {q: 'b'}})
    })

    it('should refresh state', () => {
      ngReduxMock.clearActions()
      ngReduxMock.setState({router: {query: {a: 'b'}}})

      listPage.bindings.myOnRefresh()
      scope.$digest()

      expect(ngReduxMock.getActionTypes()).toEqual(['GET_ENTRIES'])
      expect(ngReduxMock.getActions()[0].url).toContain('a=b')
    })
  })
})
