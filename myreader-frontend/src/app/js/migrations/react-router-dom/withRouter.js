import React from 'react'
import PropTypes from 'prop-types'
import {connect, ReactReduxContext} from 'react-redux'
import {routeChange} from '../../store/router'
import {cloneObject} from '../../store/shared/objects'

const mapStateToProps = state => ({router: cloneObject(state.router)})

export const withRouter = (WrappedComponent) => {

  const WithRouter = class WithRouter extends React.Component {

    static contextType = ReactReduxContext

    static propTypes = {
      router: PropTypes.shape({
        currentRoute: PropTypes.arrayOf(PropTypes.string).isRequired,
        query: PropTypes.object.isRequired
      }).isRequired
    }

    push = ({_currentRoute, route, query, state: options}) => {
      const toRoute = _currentRoute ? _currentRoute : route
      this.context.store.dispatch(routeChange({route: toRoute, query}, options))
    }

    render() {
      const _currentRoute = this.props.router.currentRoute
      const query = this.props.router.query
      const match = {params: {...this.props.router.query}}
      const params = new URLSearchParams()

      Object.keys(query)
        .map(key => params.append(key, query[key]))

      const location = {
        _currentRoute,
        search: params.toString() === undefined ? '' : params.toString()
      }

      return (
        <WrappedComponent
          location={location}
          match={match}
          history={{push: this.push, replace: this.push}}
          {...this.props}
        />
      )
    }
  }

  return connect(
    mapStateToProps
  )(WithRouter)
}
