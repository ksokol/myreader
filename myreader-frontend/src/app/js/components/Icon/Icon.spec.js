import {render, screen} from '@testing-library/react'
import {Icon} from './Icon'

describe('Icon', () => {

  it('should render icon', () => {
    render(<Icon type='chevron-right'/>)

    expect(screen.getByRole('icon-chevron-right')).toBeVisible()
    expect(screen.getByRole('icon-chevron-right')).toHaveAttribute('viewBox', '0 0 320 512')
    expect(screen.getByRole('icon-chevron-right').querySelector('path')).toHaveAttribute('d', expect.stringContaining('M285.476 272'))

    render(<Icon type='chevron-down'/>)

    expect(screen.getByRole('icon-chevron-down')).toBeVisible()
    expect(screen.getByRole('icon-chevron-down')).toHaveAttribute('viewBox', '0 0 448 512')
    expect(screen.getByRole('icon-chevron-down').querySelector('path')).toHaveAttribute('d', expect.stringContaining('M207.029 381'))
  })

  it('should render icon in white color', () => {
    render(<Icon type='chevron-right' inverse={true}/>)

    expect(screen.getByRole('icon-chevron-right')).toHaveAttribute('fill', '#FFFFFF')
  })

  it('should render icon in gray color', () => {
    render(<Icon type='chevron-right'/>)

    expect(screen.getByRole('icon-chevron-right')).toHaveAttribute('fill', '#808080')
  })
})
