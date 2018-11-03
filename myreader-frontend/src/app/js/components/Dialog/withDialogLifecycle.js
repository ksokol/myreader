import React from 'react'
import {noop} from '../../shared/utils'
import PropTypes from 'prop-types'

const withDialogLifecycle = WrappedDialog => {

  const WithDialogLifecycle = class WithDialogLifecycle extends React.Component {

    constructor(props) {
      super(props)

      this.dialogRef = React.createRef()
    }

    componentDidMount() {
      this.props.dialogRef(this.dialogRef)
      this.dialogRef.showModal()
    }

    componentWillUnmount() {
      this.dialogRef.close()
    }

    render () {
      return (
        <WrappedDialog {...this.props} dialogRef={el => this.dialogRef = el}>
          {this.props.children}
        </WrappedDialog>
      )
    }
  }

  WithDialogLifecycle.propTypes = {
    dialogRef: PropTypes.func
  }

  WithDialogLifecycle.defaultProps = {
    dialogRef: noop
  }

  return WithDialogLifecycle
}

export default withDialogLifecycle
