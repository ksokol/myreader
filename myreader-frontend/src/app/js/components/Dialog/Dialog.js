import './Dialog.css'
import React from 'react'
import * as ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import {IconButton} from '../Buttons'
import withDialogLifecycle from './withDialogLifecycle'
import withDialogPolyfill from './withDialogPolyfill'

const DialogWrapper = React.forwardRef(({header, body, footer, onClickClose}, ref) => {
  return ReactDom.createPortal(
    <dialog ref={ref}>
      <div className='my-dialog'>
        <IconButton className='my-dialog__close-button' onClick={onClickClose} type='times' role='close-dialog' />
        {header && <div className='my-dialog__header'>{header}</div>}
        {body && <div className='my-dialog__body'>{body}</div>}
        {footer && <div className='my-dialog__footer'>{footer}</div>}
      </div>
    </dialog>,
    document.body
  )
})

DialogWrapper.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node,
  onClickClose: PropTypes.func
}

export default withDialogLifecycle(withDialogPolyfill(DialogWrapper))
