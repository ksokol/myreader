import React from 'react'
import {mount} from 'enzyme'
import {AdminOverview} from './AdminOverview'

describe('AdminOverview', () => {

  let props

  const createWrapper = () => mount(<AdminOverview {...props} />)

  beforeEach(() => {
    props = {
      applicationInfo: undefined,
      rebuildSearchIndex: jest.fn()
    }
  })

  it('should trigger prop function "rebuildSearchIndex" when button clicked', () => {
    createWrapper().find('Button').props().onClick()

    expect(props.rebuildSearchIndex).toHaveBeenCalled()
  })

  it('should not render application info component when prop "applicationInfo" is undefined', () => {
    createWrapper()

    expect(createWrapper().find('ApplicationInfo').exists()).toEqual(false)
  })

  it('should not render application info component when prop "applicationInfo" is an empty object', () => {
    props.applicationInfo = {}

    expect(createWrapper().find('ApplicationInfo').exists()).toEqual(false)
  })

  it('should render application info component when prop "applicationInfo" is present', () => {
    props.applicationInfo = {
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected buildTime',
    }

    expect(createWrapper().find('ApplicationInfo').props()).toEqual({
      branch: 'expected branch',
      commitId: 'expected commitId',
      version: 'expected version',
      buildTime: 'expected buildTime',
    })
  })
})
