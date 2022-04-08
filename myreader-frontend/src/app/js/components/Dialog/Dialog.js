import './Dialog.css'
import {useEffect, useRef} from 'react'
import * as ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import {IconButton} from '../Buttons'

export function Dialog({header, body, footer, onClickClose}) {
  const dialogRef = useRef()

  useEffect(() => {
    const current = dialogRef.current
    current.showModal()
    return () => current.close()
  }, [])

  return ReactDom.createPortal(
    <dialog
      ref={dialogRef}
    >
      <div className='my-dialog'>
        <IconButton
          className='my-dialog__close-button'
          onClick={onClickClose}
          type='times'
          role='close-dialog'
        />
        {header && (
          <div className='my-dialog__header'>{header}</div>
        )}
        {body && (
          <div className='my-dialog__body'>{body}</div>
        )}
        {footer && (
          <div className='my-dialog__footer'>{footer}</div>
        )}
      </div>
    </dialog>,
    document.body
  )
}

Dialog.propTypes = {
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node,
  onClickClose: PropTypes.func
}
