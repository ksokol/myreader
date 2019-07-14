import {AdminApi} from './AdminApi'
import {PROCESSING, INFO} from '../constants'
import {exchange} from './exchange'

jest.mock('./exchange', () => ({
  exchange: jest.fn()
}))

describe('AdminApi', () => {

  let adminApi

  beforeEach(() => {
    exchange.mockClear()
    adminApi = new AdminApi()
  })

  it('should call PUT processing endpoint', () => {
    exchange.mockResolvedValueOnce({})
    adminApi.rebuildSearchIndex()

    expect(exchange).toHaveBeenCalledWith({
      body: {
        process: 'indexSyncJob'
      },
      method: 'PUT',
      url: PROCESSING
    })
  })

  it('should return expected response when PUT processing succeeded', async () => {
    exchange.mockResolvedValueOnce({})

    await expect(adminApi.rebuildSearchIndex()).resolves.toEqual({})
  })

  it('should call info endpoint', () => {
    exchange.mockResolvedValueOnce({})
    adminApi.fetchApplicationInfo()

    expect(exchange).toHaveBeenCalledWith({
      method: 'GET',
      url: INFO
    })
  })

  it('should return expected response with default values when GET info succeeded', async () => {
    exchange.mockResolvedValueOnce({})
    const notAvailable = 'not available'

    await expect(adminApi.fetchApplicationInfo()).resolves.toEqual({
      branch: notAvailable,
      commitId: notAvailable,
      version: notAvailable,
      buildTime: ''
    })
  })

  it('should return expected response when GET info succeeded', async () => {
    exchange.mockResolvedValueOnce({
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
    })

    await expect(adminApi.fetchApplicationInfo()).resolves.toEqual({
      branch: 'a-branch-name',
      commitId: 'aec45',
      version: '1.0',
      buildTime: '2017-05-16T12:07:26Z'
    })
  })
})
