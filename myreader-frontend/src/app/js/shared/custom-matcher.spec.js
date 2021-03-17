function testFail() {
  fail('unexpected match')
}

describe('custom matcher', () => {

  describe('toMatchGetRequest', () => {

    it('should match', () => {
      expect({
        method: 'GET',
        url: 'some/url',
      }).toMatchGetRequest({
        url: 'some/url'
      })
    })

    it('should not match when url is empty', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url',
        }).toMatchGetRequest({
          url: ''
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when search is not equal', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url?a=b',
        }).toMatchGetRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when method is not equal', () => {
      try {
        expect({
          method: 'PATCH',
          url: 'some/url',
        }).toMatchGetRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })
  })

  describe('toMatchPatchRequest', () => {

    it('should match', () => {
      expect({
        method: 'PATCH',
        url: 'some/url',
      }).toMatchPatchRequest({
        url: 'some/url',
      })
    })

    it('should match with json body', () => {
      expect({
        method: 'PATCH',
        url: 'some/url',
        body: JSON.stringify({
          a: 'b',
        }),
      }).toMatchPatchRequest({
        url: 'some/url',
        body: {
          a: 'b',
        }
      })
    })

    it('should match with URLSearchParams body', () => {
      expect({
        method: 'PATCH',
        url: 'some/url',
        body: new URLSearchParams('a=b'),
      }).toMatchPatchRequest({
        url: 'some/url',
        body: 'a=b'
      })
    })

    it('should not match when url is empty', () => {
      try {
        expect({
          method: 'PATCH',
          url: 'some/url',
        }).toMatchPatchRequest({
          url: ''
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when search is not equal', () => {
      try {
        expect({
          method: 'PATCH',
          url: 'some/url?a=b',
        }).toMatchPatchRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when method is not equal', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url',
        }).toMatchPatchRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when body is not equal', () => {
      try {
        expect({
          method: 'PATCH',
          url: 'some/url',
          body: JSON.stringify({
            a: 'b',
            c: 'd',
          }),
        }).toMatchPatchRequest({
          url: 'some/url',
          body: {
            a: 'b'
          }
        })
        testFail()
      } catch {
        // ignore
      }
    })
  })

  describe('toMatchPostRequest', () => {

    it('should match', () => {
      expect({
        method: 'POST',
        url: 'some/url',
      }).toMatchPostRequest({
        url: 'some/url',
      })
    })

    it('should match with JSON body', () => {
      expect({
        method: 'POST',
        url: 'some/url',
        body: JSON.stringify({
          a: 'b',
        }),
      }).toMatchPostRequest({
        url: 'some/url',
        body: {
          a: 'b',
        }
      })
    })

    it('should match with URLSearchParams body', () => {
      expect({
        method: 'POST',
        url: 'some/url',
        body: new URLSearchParams('a=b'),
      }).toMatchPostRequest({
        url: 'some/url',
        body: 'a=b'
      })
    })

    it('should not match when url is empty', () => {
      try {
        expect({
          method: 'POST',
          url: 'some/url',
        }).toMatchPostRequest({
          url: ''
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when search is not equal', () => {
      try {
        expect({
          method: 'POST',
          url: 'some/url?a=b',
        }).toMatchPostRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when method is not equal', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url',
        }).toMatchPostRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when body is not equal', () => {
      try {
        expect({
          method: 'POST',
          url: 'some/url',
          body: JSON.stringify({
            a: 'b',
            c: 'd',
          }),
        }).toMatchPostRequest({
          url: 'some/url',
          body: {
            a: 'b'
          }
        })
        testFail()
      } catch {
        // ignore
      }
    })
  })

  describe('toMatchDeleteRequest', () => {

    it('should match', () => {
      expect({
        method: 'DELETE',
        url: 'some/url',
      }).toMatchDeleteRequest({
        url: 'some/url',
      })
    })

    it('should not match', () => {
      try {
        expect({
          method: 'POST',
          url: 'some/url',
        }).toMatchDeleteRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })
  })

  describe('toMatchPutRequest', () => {

    it('should match', () => {
      expect({
        method: 'PUT',
        url: 'some/url',
      }).toMatchPutRequest({
        url: 'some/url',
      })
    })

    it('should match with body', () => {
      expect({
        method: 'PUT',
        url: 'some/url',
        body: JSON.stringify({
          a: 'b',
        }),
      }).toMatchPutRequest({
        url: 'some/url',
        body: {
          a: 'b',
        }
      })
    })

    it('should not match when url is empty', () => {
      try {
        expect({
          method: 'PUT',
          url: 'some/url',
        }).toMatchPutRequest({
          url: ''
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when search is not equal', () => {
      try {
        expect({
          method: 'PUT',
          url: 'some/url?a=b',
        }).toMatchPutRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when method is not equal', () => {
      try {
        expect({
          method: 'GET',
          url: 'some/url',
        }).toMatchPutRequest({
          url: 'some/url'
        })
        testFail()
      } catch {
        // ignore
      }
    })

    it('should not match when body is not equal', () => {
      try {
        expect({
          method: 'PUT',
          url: 'some/url',
          body: JSON.stringify({
            a: 'b',
            c: 'd',
          }),
        }).toMatchPutRequest({
          url: 'some/url',
          body: {
            a: 'b'
          }
        })
        testFail()
      } catch {
        // ignore
      }
    })
  })
})
