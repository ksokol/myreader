import {useMemo} from 'react'
import determineRGB from './determineRGB'

export function Badge({text, color, role}) {
  const rgb = useMemo(() => {
    return determineRGB(color)
  }, [color])

  return (
    <div
      style={{
        '--red': rgb.red,
        '--green': rgb.green,
        '--blue': rgb.blue,
      }}
      className='my-badge'
      role={role || 'badge'}
    >
      <span>{text}</span>
    </div>
  )
}
