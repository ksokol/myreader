import React from 'react'
import PropTypes from 'prop-types'
import {ReactReduxContext} from 'react-redux'
import MediaBreakpointContext from './MediaBreakpointContext'
import {createMediaQueryList} from './createMediaQueryList'
import {mediaBreakpointChanged} from '../../store'

export class MediaBreakpointProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  static contextType = ReactReduxContext

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

      // TODO remove me as soon as all connected components migrated to Context API
      this.context.store.dispatch(mediaBreakpointChanged(mediaBreakpoint))
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
