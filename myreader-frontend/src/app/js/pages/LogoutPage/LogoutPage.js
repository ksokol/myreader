import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Redirect} from 'react-router-dom'
import {LOGIN_URL} from '../../constants'
import {authenticationApi} from '../../api'
import {toast} from '../../components/Toast'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {useSecurity} from '../../contexts/security'

function LogoutPage({historyGoBack}) {
  const [loggedOut, setLoggedOut] = useState(false)
  const {doUnAuthorize} = useSecurity()

  useEffect(() => {
    async function logout() {
      try {
        await authenticationApi.logout()
        doUnAuthorize()
        setLoggedOut(true)
      } catch {
        historyGoBack()
        toast('Logout failed', {error: true})
      }
    }
    logout()
  }, [historyGoBack, doUnAuthorize])

  return loggedOut ? <Redirect to={LOGIN_URL} /> : null
}

LogoutPage.propTypes = {
  historyGoBack: PropTypes.func.isRequired,
}

export default withLocationState(LogoutPage)

