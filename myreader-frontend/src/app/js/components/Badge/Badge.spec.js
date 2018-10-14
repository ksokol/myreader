import {Badge} from '.'
import React from 'react'
import {render, mount} from 'enzyme'

describe('Badge', () => {

  let context2d

  const uniqueColor = () => `${new Date().getTime()}`
  const createMount = props => mount(<Badge {...props} />)
  const byCanvas = it => it[0] === 'canvas'

  beforeEach(() => {
    context2d = {
      fillRect: jest.fn(),
      getImageData: jest.fn().mockReturnValue({data: []})
    }

    const createElement = document.createElement

    document.createElement = jest.fn().mockImplementation(localName => {
      if (localName !== 'canvas') {
        return createElement.call(document, localName)
      }

      const canvasMock = createElement('div')
      canvasMock.getContext = param => param === '2d' ? context2d : undefined
      return canvasMock
    })
  })

  it('should render component with given text', () => {
    expect(render(<Badge text='sample text' />).text()).toEqual('sample text')
  })

  it('should initiate canvas with mandatory values in order to determine RGB value from prop "color"', () => {
    createMount({color: 'yellow'})

    expect(context2d.fillStyle).toEqual('yellow')
    expect(context2d.fillRect).toHaveBeenCalledWith(0, 0, 1, 1)
  })

  it('should transform prop "color" to lower case', () => {
    createMount({color: '#FFF'})

    expect(context2d.fillStyle).toEqual('#fff')
  })

  it('should retrieve default RGB value from cache when prop "color" is undefined', () => {
    createMount()

    expect(document.createElement.mock.calls.filter(byCanvas).length).toEqual(0)
  })

  it('should retrieve default RGB value from cache when prop "color" value is undefined', () => {
    createMount({color: undefined})

    expect(document.createElement.mock.calls.filter(byCanvas).length).toEqual(0)
  })

  it('should return cached RGB value when cache contains value for prop "color"', () => {
    const color = uniqueColor()
    createMount({color})
    createMount({color})

    expect(document.createElement.mock.calls.filter(byCanvas).length).toEqual(1)
  })

  it('should determine RGB value when cache does not contain value for prop "color"', () => {
    createMount({color: uniqueColor()})
    createMount({color: uniqueColor()})

    expect(document.createElement.mock.calls.filter(byCanvas).length).toEqual(2)
  })

  it('should set CSS custom properties red, green and blue from canvas image data', () => {
    context2d.getImageData = jest.fn().mockReturnValue({data: [100, 101, 102]})
    const wrapper = createMount({color: uniqueColor()})
    const spy = jest.spyOn(wrapper.instance().badgeRef.current.style, 'setProperty')
    wrapper.instance().componentDidMount()

    expect(spy).toHaveBeenNthCalledWith(1, '--red', 100)
    expect(spy).toHaveBeenNthCalledWith(2, '--green', 101)
    expect(spy).toHaveBeenNthCalledWith(3, '--blue', 102)
  })
})
