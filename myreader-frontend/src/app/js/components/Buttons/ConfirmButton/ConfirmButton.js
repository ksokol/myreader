import './ConfirmButton.css'
import {useState} from 'react'
import PropTypes from 'prop-types'
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

ConfirmButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any
}
