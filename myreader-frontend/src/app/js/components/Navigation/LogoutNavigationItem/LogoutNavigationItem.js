import {LOGIN_PAGE_PATH} from '../../../constants'
import {useSecurity} from '../../../contexts/security'
import {NavigationItem} from '../NavigationItem'
import {Redirect} from '../../router'

export function LogoutNavigationItem() {
  const {authorized, doUnAuthorize} = useSecurity()

  const logout = async (event) => {
    event.preventDefault()
    doUnAuthorize()
  }

  return authorized ? (
    <NavigationItem
      className='my-navigation__item--red'
      title='Logout'
      onClick={logout}
    />
  ) : (
    <Redirect pathname={LOGIN_PAGE_PATH} />
  )
}
