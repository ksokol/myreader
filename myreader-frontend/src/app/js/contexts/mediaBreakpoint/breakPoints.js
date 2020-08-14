import {supportedBreakpoints} from '../../constants'

export function breakPoints() {
  const mediaQueryList = createMediaQueryList()

  return {
    mediaQueryList,
    mediaBreakpointNames: breakPointNames(mediaQueryList)
  }
}

function createMediaQueryList() {
  return Object.entries(supportedBreakpoints()).reduce((mediaQueryLists, [name, mediaQueryString]) => {
    const mql = window.matchMedia(mediaQueryString)
    mediaQueryLists[mql.media] = {name, mql}
    return mediaQueryLists
  }, {})
}

function breakPointNames(mediaQueryList) {
  return Object.values(mediaQueryList).map(query => query.name)
}
