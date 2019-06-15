import {supportedBreakpoints} from '../../constants'

export function createMediaQueryList() {
  return Object.entries(supportedBreakpoints()).reduce((mediaQueryLists, [name, mediaQueryString]) => {
    const mql = window.matchMedia(mediaQueryString)
    mediaQueryLists[mql.media] = {name, mql}
    return mediaQueryLists
  }, {})
}
