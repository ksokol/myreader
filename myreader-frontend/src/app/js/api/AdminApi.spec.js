import {AdminApi} from './AdminApi'
import {PROCESSING} from '../constants'

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
      api.request = jest.fn().mockResolvedValue({ok: false, data: 'expected error'})

      await expect(adminApi.rebuildSearchIndex()).rejects.toEqual('expected error')
    })
  })
})
