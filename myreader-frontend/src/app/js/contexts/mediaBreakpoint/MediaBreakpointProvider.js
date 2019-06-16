import React from 'react'
import PropTypes from 'prop-types'
import MediaBreakpointContext from './MediaBreakpointContext'
import {createMediaQueryList} from './createMediaQueryList'

export class MediaBreakpointProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  state = {
    mediaBreakpoint: ''
  }

  mediaQueryList = createMediaQueryList()
  mediaBreakpointNames = Object.values(this.mediaQueryList).map(query => query.name)

  componentDidMount() {
    Object
      .values(this.mediaQueryList)
      .forEach(({mql}) => {
        mql.addListener(this.handleMediaBreakpointChange)
        this.handleMediaBreakpointChange(mql)
      })
  }

  componentWillUnmount() {
    Object
      .values(this.mediaQueryList)
      .forEach(({mql}) => mql.removeListener(this.handleMediaBreakpointChange))
  }

  handleMediaBreakpointChange = event => event.matches && this.updateState(event.media)

  updateState = media => {
    const mediaBreakpoint = this.mediaBreakpointNames.find(name => name === this.mediaQueryList[media].name)
    if (mediaBreakpoint) {
      this.setState({
        mediaBreakpoint
      })
    }
  }

  render() {
    return (
      <MediaBreakpointContext.Provider value={this.state}>
        {this.props.children}
      </MediaBreakpointContext.Provider>
    )
  }
}
