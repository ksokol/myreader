import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {loginRoute} from '../../routes'
import {authorizedSelector} from '../../store'
import {ROLE_USER} from '../../constants'

const mapStateToProps = state => ({
  ...authorizedSelector(state)
})

const secured = (WrappedComponent, role = ROLE_USER) => {
  const Secured = ({roles}) => roles.includes(role) ? <WrappedComponent /> : <Redirect to={loginRoute()}/>

  Secured.propTypes = {
    authorized: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  return connect(mapStateToProps)(Secured)
}

export default secured
