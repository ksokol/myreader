import React from 'react'
import PropTypes from 'prop-types'
import {generatePath, withRouter} from 'react-router'
import LocationStateContext from './LocationStateContext'

function toSearchParams(location = {}) {
  const query = {}
  for (const [key, value] of new URLSearchParams(location.search || '').entries()) {
    query[key] = value
  }
  return query
}

function toSearch(queryParam) {
  const searchParams = new URLSearchParams()
  for (const [k, v] of Object.entries(queryParam)) {
    if (typeof v !== 'undefined' && v !== null) {
      searchParams.set(k, v)
    }
  }
  return searchParams.toString()
}

export const withLocationState = Component => {

  const WithLocationState = class WithLocationState extends React.Component {

    static propTypes = {
      children: PropTypes.any,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
      locationStateStamp: PropTypes.number.isRequired,
      reload: PropTypes.func.isRequired,
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired
      }).isRequired
    }

    state = {
      pathname: this.props.location.pathname,
      search: this.props.location.search,
      locationChanged: false,
      locationReload: false,
      locationStateStamp: this.props.locationStateStamp
    }

    static getDerivedStateFromProps(props, state) {
      const {
        location: {
          pathname,
          search
        },
        locationStateStamp
      } = props

      const locationChanged = pathname !== state.pathname || search !== state.search
      const locationReload = locationStateStamp !== state.locationStateStamp

      return {
        pathname,
        search,
        locationChanged,
        locationReload,
        locationStateStamp
      }
    }

    push = ({searchParams = {}} = {}) => {
      this.props.history.push({
        ...this.props.location,
        search: toSearch(searchParams)
      })
    }

    replace = ({pathname, params}) => {
      this.props.history.replace({
        pathname: generatePath(pathname, {...params})
      })
    }

    render() {
      const {
        location,
        match,
        history,
        reload,
        locationStateStamp,
        match: {params},
        ...componentProps
      } = this.props

      const {
        locationChanged,
        locationReload
      } = this.state

      return (
        <Component
          {...componentProps}
          searchParams={toSearchParams(location)}
          params={params}
          historyPush={this.push}
          historyReplace={this.replace}
          historyReload={reload}
          historyGoBack={history.goBack}
          locationChanged={locationChanged}
          locationReload={locationReload}
        />
      )
    }
  }

  return withRouter(props => {
    return (
      <LocationStateContext.Consumer>
        {value => <WithLocationState {...value} {...props} />}
      </LocationStateContext.Consumer>
    )}
  )
}
