function testFail() {
  fail('unexpected match')
}

describe('custom matcher', () => {

  describe('toContainObject', () => {

    it('should return true when objects are equal', () => {
      expect({
        prop1: 'value1',
        nested: {
          prop2: 'value2'
        }
      }).toContainObject({
        prop1: 'value1',
        nested: {
          prop2: 'value2'
        }
      })
    })

    it('should return true when nested properties are equal', () => {
      expect({
        prop1: 'value1',
        nested: {
          prop2: 'value2'
        }
      }).toContainObject({
        nested: {
          prop2: 'value2'
        }
      })
    })

    it('should return true when properties are equal', () => {
      expect({
        prop1: 'value1',
        nested: {
          prop2: 'value2'
        }
      }).toContainObject({
        prop1: 'value1'
      })
    })

    it('should return false when nested properties are not equal', () => {
      try {
        expect({
          prop1: 'value1',
          nested: {
            prop2: 'value2'
          }
        }).toContainObject({
          prop1: 'value1',
          nested: {prop2: 'value'
          }
        })
        fail('unexpected match')
      } catch {
        // ignore
      }
    })

    it('should return false when properties are not equal', () => {
      try {
        expect({
          prop1: 'value1',
        }).toContainObject({
          prop1: 'value',
        })
        testFail()
      } catch {
        // ignore
      }
    })
  })

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

    it('should match with body', () => {
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

    it('should match with body', () => {
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
})
