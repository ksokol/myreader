const unexpectedMatch = 'unexpected match'

describe('custom matcher', () => {

  describe('toMatchRequest', () => {

    it('should match', () => {
      expect({
        method: 'GET',
        url: 'some/url',
      }).toMatchRequest({
        method: 'GET',
        url: 'some/url',
      })
    })

    it('should not match when url is empty', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url',
        }).toMatchRequest({
          method: 'GET',
          url: '',
        })
        fail(unexpectedMatch)
      } catch {
        // ignore
      }
    })

    it('should not match when search is not equal', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url?a=b',
        }).toMatchRequest({
          method: 'GET',
          url: 'some/url',
        })
        fail(unexpectedMatch)
      } catch {
        // ignore
      }
    })

    it('should not match when method is not equal', () => {
      try {
        expect({
          method: 'PATCH',
          url: 'some/url',
        }).toMatchRequest({
          method: 'GET',
          url: 'some/url',
        })
        fail(unexpectedMatch)
      } catch {
        // ignore
      }
    })
  })
})
