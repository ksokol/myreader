import React from 'react'
import PropTypes from 'prop-types'
import {Provider} from 'react-redux'
import {store} from '../store/bootstrap'

const ContainerComponentBridge = props => {
  const ContainerComponent = props.component()

  return (
    <Provider store={store}>
      <ContainerComponent></ContainerComponent>
    </Provider>
  )
}

ContainerComponentBridge.propTypes = {
  component: PropTypes.func.isRequired
}

/**
 * part of AngularJS exit strategy
 * @deprecated
 */
export default ContainerComponentBridge
