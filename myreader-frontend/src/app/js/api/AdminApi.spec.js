import {AdminApi} from './AdminApi'
import {PROCESSING, INFO} from '../constants'

const expectedError = 'expected error'

describe('AdminApi', () => {

  let api, adminApi

  beforeEach(() => {
    api = {
      request: jest.fn().mockResolvedValueOnce({ok: true})
    }
    adminApi = new AdminApi(api)
  })

  describe(`${PROCESSING}`, () => {

    it('should call endpoint', () => {
      adminApi.rebuildSearchIndex()

      expect(api.request).toHaveBeenCalledWith({
        body: {
          process: 'indexSyncJob'
        },
        method: 'PUT',
        url: PROCESSING
      })
    })

    it('should return expected response when request succeeded', async () => {
      await expect(adminApi.rebuildSearchIndex()).resolves.toEqual({})
    })

    it('should return expected error response when request failed', async () => {
      api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

      await expect(adminApi.rebuildSearchIndex()).rejects.toEqual(expectedError)
    })
  })

  describe(`${INFO}`, () => {

    it('should call endpoint', () => {
      adminApi.fetchApplicationInfo()

      expect(api.request).toHaveBeenCalledWith({
        method: 'GET',
        url: INFO
      })
    })

    it('should return expected response when request succeeded', async () => {
      const notAvailable = 'not available'

      await expect(adminApi.fetchApplicationInfo()).resolves.toEqual({
        branch: notAvailable,
        commitId: notAvailable,
        version: notAvailable,
        buildTime: ''
      })
    })

    it('should return expected data', async () => {
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

      api.request = jest.fn().mockResolvedValue({ok: true, data})

      await expect(adminApi.fetchApplicationInfo()).resolves.toEqual({
        branch: 'a-branch-name',
        commitId: 'aec45',
        version: '1.0',
        buildTime: '2017-05-16T12:07:26Z'
      })
    })

    it('should return expected error response when request failed', async () => {
      api.request = jest.fn().mockResolvedValue({ok: false, data: expectedError})

      await expect(adminApi.fetchApplicationInfo()).rejects.toEqual(expectedError)
    })
  })
})
