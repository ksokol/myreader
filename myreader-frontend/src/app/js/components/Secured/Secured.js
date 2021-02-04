import React from 'react'
import {Redirect} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {useSecurity} from '../../contexts/security'

export function Secured(WrappedComponent) {
  const {authorized} = useSecurity()

  return authorized
    ? <WrappedComponent />
    : <Redirect to={LOGIN_URL}/>
}
