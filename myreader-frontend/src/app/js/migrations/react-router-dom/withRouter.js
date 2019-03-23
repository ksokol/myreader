import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {routeSelector} from '../../store/router'

const mapStateToProps = state => routeSelector(state)

export const withRouter = (WrappedComponent) => {

  const WithRouter = class WithRouter extends React.Component {

    static propTypes = {
      router: PropTypes.shape({
        query: PropTypes.object.isRequired
      }).isRequired
    }

    render() {
      const query = this.props.router.query
      const params = new URLSearchParams()

      Object.keys(query)
        .filter(key => query[key])
        .map(key => params.append(key, query[key]))

      const location = {
        search: params.toString() === undefined ? '' : params.toString()
      }

      return (
        <WrappedComponent
          location={location}
          {...this.props}
        />
      )
    }
  }

  return connect(
    mapStateToProps
  )(WithRouter)
}
