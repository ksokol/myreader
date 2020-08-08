import {useContext} from 'react'
import MediaBreakpointContext from './MediaBreakpointContext'

export function useMediaBreakpoint() {
  return useContext(MediaBreakpointContext)
}
