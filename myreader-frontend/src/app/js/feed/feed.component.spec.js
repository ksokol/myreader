import {componentMock, mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/feed/feed.component.spec.js', () => {

  let scope, $timeout, page, ngReduxMock, feed, titleInput, urlInput

  const PageObject = el => {
    return {
      feedUrlLink: () => el.querySelector('a'),
      clickSaveButton: () => el.querySelectorAll('button')[0].click(),
      clickDeleteButton: () => el.querySelectorAll('button')[1].click(),
      clickYesButton: () => el.querySelectorAll('button')[1].click()
    }
  }

  const givenState = (selectedFeed = {}) => {
    ngReduxMock.setState({admin: {selectedFeed}})
    scope.$digest()
  }

  beforeEach(() => {
    titleInput = reactComponent('FeedTitleInput')
    urlInput = reactComponent('FeedUrlInput')
    angular.mock.module('myreader', componentMock('myFeedFetchError'), mockNgRedux(), titleInput, urlInput)
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux, _$timeout_) => {
    $timeout = _$timeout_
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

    feed = {
      uuid: 'expected uuid',
      title: 'expected title',
      url: 'expected url',
      other: 'other field'
    }

    const element = $compile('<my-feed></my-feed>')(scope)
    page = new PageObject(element[0])
    scope.$digest()
  }))

  it('should pass expected props to title input component', () => {
    givenState(feed)

    expect(titleInput.bindings).toContainObject({
      label: 'Title',
      name: 'title',
      value: feed.title
    })
  })

  it('should pass expected props to url input component', () => {
    givenState(feed)

    expect(urlInput.bindings).toContainObject({
      type: 'url',
      label: 'Url',
      name: 'url',
      value: 'expected url',
    })
  })

  it('should save feed when save button clicked', () => {
    givenState(feed)

    titleInput.bindings.onChange('updated title')
    urlInput.bindings.onChange('updated url')
    page.clickSaveButton()

    expect(ngReduxMock.getActions()[0]).toEqualActionType('PATCH_FEED')
    expect(ngReduxMock.getActions()[0]).toContainActionData({body: {title: 'updated title', url: 'updated url'}})
  })

  it('should render validation messages', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({
      status: 400,
      data: {
        fieldErrors: [
          {'field': 'url', 'message': 'expected url error'},
          {'field': 'title', 'message': 'expected title error'}
        ]
      }
    })

    page.clickSaveButton()

    setTimeout(() => {
      scope.$digest()
      expect(titleInput.bindings.validations)
        .toEqual([{field: 'url', message: 'expected url error'}, {field: 'title', message: 'expected title error'}])
      expect(urlInput.bindings.validations)
        .toEqual([{field: 'url', message: 'expected url error'}, {field: 'title', message: 'expected title error'}])
      done()
    })
  })

  it('should clear validation messages when save button clicked again', done => {
    jest.useRealTimers()
    ngReduxMock.dispatch.mockRejectedValueOnce({
      status: 400,
      data: {
        fieldErrors: [
          {'field': 'url', 'message': 'expected url error'},
          {'field': 'title', 'message': 'expected title error'}
        ]
      }
    })

    page.clickSaveButton()

    setTimeout(() => {
      scope.$digest()
      page.clickSaveButton()
      expect(titleInput.bindings.validations).toBeUndefined()
      expect(urlInput.bindings.validations).toBeUndefined()
      done()
    })
  })

  it('should delete feed', () => {
    givenState(feed)
    page.clickDeleteButton()
    $timeout.flush(250)
    page.clickYesButton()

    expect(ngReduxMock.getActions()[0]).toEqualActionType('DELETE_FEED')
    expect(ngReduxMock.getActions()[0].url).toContain('/feeds/expected uuid')
  })

  it('should open url safely', () => {
    givenState(feed)
    const link = page.feedUrlLink()

    expect(link.attributes['ng-href'].value).toEqual('expected url')
    expect(link.attributes['target'].value).toEqual('_blank')
    expect(link.attributes['rel'].value).toEqual('noopener noreferrer')
  })
})
