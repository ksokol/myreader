import React, {useCallback, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import iro from '@jaames/iro'

const changeEventName = 'color:change'

export function ColorPicker({color, onChange}) {
  const nodeRef = useRef()
  const colorPickerRef = useRef()

  const onChangeListener = useCallback(({hexString}) => {
    onChange && onChange(hexString)
  }, [onChange])

  useEffect(() => {
    colorPickerRef.current = new iro.ColorPicker(nodeRef.current)
    colorPickerRef.current.on(changeEventName, onChangeListener)
    return () => colorPickerRef.current.off(changeEventName, onChangeListener)
  }, [onChangeListener])

  useEffect(() => {
    colorPickerRef.current.color.hexString = color || '#FFFFFF'
  }, [color])

  return (
    <div
      role='color-picker'
      ref={nodeRef}
    />
  )
}

ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func
}
