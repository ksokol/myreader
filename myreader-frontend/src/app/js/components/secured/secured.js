import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {authorizedSelector} from '../../store'

const mapStateToProps = state => ({
  ...authorizedSelector(state)
})

const secured = (WrappedComponent, allowedRoles = []) => {
  const Secured = ({roles}) => roles.some(role => allowedRoles.includes(role))
    ? <WrappedComponent />
    : <Redirect to={LOGIN_URL}/>

  Secured.propTypes = {
    authorized: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  return connect(mapStateToProps)(Secured)
}

export default secured
