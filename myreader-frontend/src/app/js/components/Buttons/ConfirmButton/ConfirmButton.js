import {useState} from 'react'
import {Button} from '..'

export function ConfirmButton({
  disabled = false,
  children,
  onClick,
  ...buttonProps
}) {
  const [presentConfirmation, setPresentConfirmation] = useState(false)

  return presentConfirmation ?
    <>
      <Button
        className='my-confirm-button__confirm'
        onClick={() => {
          setPresentConfirmation(false)
          onClick()}
        }
        disabled={disabled}
        caution
      >Yes
      </Button>
      <Button
        className='my-confirm-button__reject'
        onClick={() => setPresentConfirmation(false)}
        disabled={disabled}
        primary
      >No
      </Button>
    </> :
    <Button
      {...buttonProps}
      disabled={disabled}
      onClick={() => setPresentConfirmation(true)}
    >{children}
    </Button>
}
