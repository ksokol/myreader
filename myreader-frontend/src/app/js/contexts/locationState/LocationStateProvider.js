import React from 'react'
import PropTypes from 'prop-types'
import LocationStateContext from './LocationStateContext'

export class LocationStateProvider extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  state = {
    locationStateStamp: Date.now()
  }

  reload = () => {
    this.setState({
      locationStateStamp: Date.now()
    })
  }

  render() {
    return (
      <LocationStateContext.Provider value={{
        ...this.state,
        reload: this.reload
      }}>
        {this.props.children}
      </LocationStateContext.Provider>
    )
  }
}
