import React from 'react'
import PropTypes from 'prop-types'
import 'dialog-polyfill/dialog-polyfill.css'
import * as dialogPolyfill from 'dialog-polyfill/dialog-polyfill'
import {noop} from '../../shared/utils'

const withDialogPolyfill = WrappedDialog => {

  const WithDialogPolyfill = class WithDialogPolyfill extends React.Component {

    constructor(props) {
      super(props)

      this.dialogRef = React.createRef()
    }

    componentDidMount() {
      dialogPolyfill.registerDialog(this.dialogRef.current)
      this.props.dialogRef(this.dialogRef.current)
    }

    render() {
      return (
        <WrappedDialog {...this.props} ref={this.dialogRef}>
          {this.props.children}
        </WrappedDialog>
      )
    }
  }

  WithDialogPolyfill.propTypes = {
    dialogRef: PropTypes.func,
    children: PropTypes.any
  }

  WithDialogPolyfill.defaultProps = {
    dialogRef: noop
  }

  return WithDialogPolyfill
}

export default withDialogPolyfill
