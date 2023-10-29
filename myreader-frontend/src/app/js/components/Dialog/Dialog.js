import './Dialog.css'
import {useEffect, useRef} from 'react'
import * as ReactDom from 'react-dom'
import {IconButton} from '../Buttons'

export function Dialog({header, body, footer, onClickClose}) {
  const dialogRef = useRef()

  useEffect(() => {
    const current = dialogRef.current
    const listener = current.addEventListener('close', onClickClose)
    current.showModal()

    return () => {
      current.removeEventListener('close', listener)
      current.close()
    }
  }, [onClickClose])

  return ReactDom.createPortal(
    <dialog
      ref={dialogRef}
    >
      <div className='my-dialog'>
        <IconButton
          className='my-dialog__close-button'
          onClick={() => dialogRef.current.close()}
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
