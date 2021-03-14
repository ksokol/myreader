import React from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import {LOGIN_PAGE_PATH} from '../../../constants'
import {api} from '../../../api'
import {toast} from '../../Toast'
import {useSecurity} from '../../../contexts/security'
import {NavigationItem} from '../NavigationItem'

export function LogoutNavigationItem() {
  const {authorized, doUnAuthorize} = useSecurity()
  const history = useHistory()

  const logout = async () => {
    try {
      await api.post({
        url: 'logout'
      })
      doUnAuthorize()
    } catch {
      history.goBack()
      toast('Logout failed', {error: true})
    }
  }

  return authorized ? (
    <NavigationItem
      className='my-navigation__item--red'
      title='Logout'
      to={{}}
      onClick={logout}
    />
  ) : (
    <Redirect to={LOGIN_PAGE_PATH}/>
  )
}
