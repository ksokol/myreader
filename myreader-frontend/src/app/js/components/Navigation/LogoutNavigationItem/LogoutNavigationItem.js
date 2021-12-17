import {LOGIN_PAGE_PATH} from '../../../constants'
import {api} from '../../../api'
import {toast} from '../../Toast'
import {useSecurity} from '../../../contexts/security'
import {NavigationItem} from '../NavigationItem'
import {useRouter} from '../../../contexts/router'
import {Redirect} from '../../router'

export function LogoutNavigationItem() {
  const {authorized, doUnAuthorize} = useSecurity()
  const router = useRouter()

  const logout = async (event) => {
    event.preventDefault()
    try {
      await api.post({
        url: 'logout'
      })
      doUnAuthorize()
    } catch {
      router.goBack()
      toast('Logout failed', {error: true})
    }
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
