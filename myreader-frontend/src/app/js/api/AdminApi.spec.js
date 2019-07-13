import {AdminApi} from './AdminApi'
import {PROCESSING, INFO} from '../constants'

describe('AdminApi', () => {

  let api, adminApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({})
    }
    adminApi = new AdminApi(api)
  })

  it('should call PUT processing endpoint', () => {
    adminApi.rebuildSearchIndex()

    expect(api.request).toHaveBeenCalledWith({
      body: {
        process: 'indexSyncJob'
      },
      method: 'PUT',
      url: PROCESSING
    })
  })

  it('should return expected response when PUT processing succeeded', async () => {
    await expect(adminApi.rebuildSearchIndex()).resolves.toEqual({})
  })

  it('should call info endpoint', () => {
    adminApi.fetchApplicationInfo()

    expect(api.request).toHaveBeenCalledWith({
      method: 'GET',
      url: INFO
    })
  })

  it('should return expected response with default values when GET info succeeded', async () => {
    const notAvailable = 'not available'

    await expect(adminApi.fetchApplicationInfo()).resolves.toEqual({
      branch: notAvailable,
      commitId: notAvailable,
      version: notAvailable,
      buildTime: ''
    })
  })

  it('should return expected response when GET info succeeded', async () => {
    const data = {
      git: {
        commit: {
          id: 'aec45'
        },
        branch: 'a-branch-name'
      },
      build: {
        version: '1.0',
        time: '2017-05-16T12:07:26Z'
      }
    }

    api.request = jest.fn().mockResolvedValueOnce(data)

    await expect(adminApi.fetchApplicationInfo()).resolves.toEqual({
      branch: 'a-branch-name',
      commitId: 'aec45',
      version: '1.0',
      buildTime: '2017-05-16T12:07:26Z'
    })
  })
})
