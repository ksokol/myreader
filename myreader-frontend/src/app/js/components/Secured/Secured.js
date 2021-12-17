import {LOGIN_PAGE_PATH} from '../../constants'
import {useSecurity} from '../../contexts/security'
import {Redirect} from '../router'
import PropTypes from 'prop-types'

export function Secured({children}) {
  const {authorized} = useSecurity()

  return authorized
    ? children
    : <Redirect pathname={LOGIN_PAGE_PATH}/>
}

Secured.propTypes = {
  children: PropTypes.any
}
