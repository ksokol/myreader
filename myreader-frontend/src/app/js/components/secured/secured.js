import React from 'react'
import {Redirect} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {useSecurity} from '../../contexts/security'

const secured = (WrappedComponent, allowedRoles = []) => {
  return () => {
    const {roles} = useSecurity()

    return roles.some(role => allowedRoles.includes(role))
      ? <WrappedComponent />
      : <Redirect to={LOGIN_URL}/>
  }
}

export default secured
