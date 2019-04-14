import routerHandler from './routerHandler'

describe('routerHandler', () => {

  it('should pass action to router adapter', () => {
    const routerAdapter = jest.fn()
    routerHandler(routerAdapter)({action: {type: 'expected'}})

    expect(routerAdapter).toHaveBeenCalledWith({type: 'expected'})
  })
})
