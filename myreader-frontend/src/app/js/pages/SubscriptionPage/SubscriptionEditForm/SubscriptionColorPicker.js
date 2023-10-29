import {useState} from 'react'
import {Button} from '../../../components/Buttons'
import {Dialog} from '../../../components/Dialog/Dialog'

export function SubscriptionColorPicker({color, onSelect, onClose}) {
  const [currentColor, setCurrentColor] = useState(color)

  const body =
    <input
      type='color'
      role='color-picker'
      className='my-subscription-edit-form__color-dialog'
      value={currentColor || '#FFFFFF'}
      onChange={(event) => {
        setCurrentColor(event.target.value)
      }}
    />

  const footer =
    <>
      <Button
        onClick={() => {
          setCurrentColor(null)
        }}
      >
        reset
      </Button>
      <Button
        onClick={() => {
          onSelect(currentColor)
          onClose()
        }}
        primary
      >
        use
      </Button>
    </>

  return (
    <Dialog
      body={body}
      footer={footer}
      onClickClose={onClose}
    >
    </Dialog>
  )
}
