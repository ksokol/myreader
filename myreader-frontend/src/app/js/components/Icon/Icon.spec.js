import {render, screen} from '@testing-library/react'
import {Icon} from './Icon'

describe('Icon', () => {

  it('should set expected class for icon', () => {
    render(<Icon type='icon1'/>)

    expect(screen.getByRole('icon-icon1')).toHaveClass('my-icon')
    expect(screen.getByRole('icon-icon1')).toHaveClass('my-icon__icon1')

    render(<Icon type='icon2'/>)

    expect(screen.getByRole('icon-icon2')).toHaveClass('my-icon')
    expect(screen.getByRole('icon-icon2')).toHaveClass('my-icon__icon2')
  })

  it('should invert color when prop "inverse" ist set to true', () => {
    const spy = jest.spyOn(CSSStyleDeclaration.prototype, 'setProperty')
    render(<Icon type='icon1' inverse={true}/>)

    expect(spy).toHaveBeenCalledWith('--color', '#FFFFFF')
  })

  it('should not invert color when prop "inverse" ist set to false', () => {
    const spy = jest.spyOn(CSSStyleDeclaration.prototype, 'setProperty')
    render(<Icon type='icon1'/>)

    expect(spy).toHaveBeenCalledWith('--color', '#808080')
  })
})
