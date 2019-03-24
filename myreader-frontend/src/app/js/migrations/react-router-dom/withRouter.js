import React from 'react'
import PropTypes from 'prop-types'
import {connect, ReactReduxContext} from 'react-redux'
import {routeChange, routeSelector} from '../../store/router'

const mapStateToProps = state => routeSelector(state)

export const withRouter = (WrappedComponent) => {

  const WithRouter = class WithRouter extends React.Component {

    static contextType = ReactReduxContext

    static propTypes = {
      router: PropTypes.shape({
        currentRoute: PropTypes.arrayOf(PropTypes.string).isRequired,
        query: PropTypes.object.isRequired
      }).isRequired
    }

    push = ({_currentRoute: route, query}) => {
      this.context.store.dispatch(routeChange({route, query}))
    }

    render() {
      const _currentRoute = this.props.router.currentRoute
      const query = this.props.router.query
      const params = new URLSearchParams()

      Object.keys(query)
        .filter(key => query[key])
        .map(key => params.append(key, query[key]))

      const location = {
        _currentRoute,
        search: params.toString() === undefined ? '' : params.toString()
      }

      return (
        <WrappedComponent
          location={location}
          history={{push: this.push}}
          {...this.props}
        />
      )
    }
  }

  return connect(
    mapStateToProps
  )(WithRouter)
}
