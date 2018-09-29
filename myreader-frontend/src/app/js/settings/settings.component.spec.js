import {mockNgRedux, reactComponent} from '../shared/test-utils'

describe('src/app/js/settings/settings.component.spec.js', () => {

  let scope, settings, ngReduxMock

  beforeEach(() => {
    settings = reactComponent('Settings')
    angular.mock.module('myreader', settings, mockNgRedux())
  })

  beforeEach(inject(($rootScope, $compile, $ngRedux) => {
    scope = $rootScope.$new(true)
    ngReduxMock = $ngRedux

    ngReduxMock.setState({
      settings: {
        pageSize: 20,
        showUnseenEntries: false,
        showEntryDetails: true
      }
    })

    $compile('<my-settings></my-settings>')(scope)
    scope.$digest()
  }))

  it('should initialize settings component with given settings', () => {
    expect(settings.bindings.settings).toEqual({
      pageSize: 20,
      showUnseenEntries: false,
      showEntryDetails: true
    })
  })

  it('should dispatch action with given settings', () => {
    settings.bindings.onChange({
      pageSize: 10,
      showUnseenEntries: true,
      showEntryDetails: false
    })

    expect(ngReduxMock.getActions()[0]).toEqual({
      type: 'SETTINGS_UPDATE',
      settings: {
        pageSize: 10,
        showUnseenEntries: true,
        showEntryDetails: false
      }
    })
  })
})
