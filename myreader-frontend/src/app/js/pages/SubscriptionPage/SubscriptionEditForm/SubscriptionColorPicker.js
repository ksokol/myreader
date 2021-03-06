import {useState} from 'react'
import PropTypes from 'prop-types'
import {Button} from '../../../components/Buttons'
import {ColorPicker} from '../../../components/ColorPicker/ColorPicker'
import {Dialog} from '../../../components/Dialog/Dialog'

export function SubscriptionColorPicker({color, onSelect, onClose}) {
  const [currentColor, setCurrentColor] = useState(color)

  const body =
    <ColorPicker
      color={currentColor}
      onChange={setCurrentColor}
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

SubscriptionColorPicker.propTypes = {
  color: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
