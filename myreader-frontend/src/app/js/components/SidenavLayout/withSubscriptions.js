import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchSubscriptions} from '../../store'

const withSubscriptions = WrappedComponent => {

  const WithSubscriptions = ({dispatch, ...props}) => {
    dispatch(fetchSubscriptions())
    return <WrappedComponent {...props} />
  }

  WithSubscriptions.propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  return connect()(WithSubscriptions)
}

export default withSubscriptions
