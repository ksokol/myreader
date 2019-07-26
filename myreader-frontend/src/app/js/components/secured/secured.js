import React from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {withAppContext} from '../../contexts'

const secured = (WrappedComponent, allowedRoles = []) => {
  const Secured = ({roles}) => roles.some(role => allowedRoles.includes(role))
    ? <WrappedComponent />
    : <Redirect to={LOGIN_URL}/>

  Secured.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired
  }

  return withAppContext(Secured)
}

export default secured
