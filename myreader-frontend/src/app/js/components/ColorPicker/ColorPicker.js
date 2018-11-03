import './ColorPicker.css'
import React from 'react'
import PropTypes from 'prop-types'
import GithubPicker from 'react-color/lib/Github'
import colorPalette from './colorPalette'
import {noop} from '../../shared/utils'

const ColorPicker = ({onChange}) =>
  <GithubPicker
    className='my-color-picker'
    colors={colorPalette}
    onChange={color => onChange(color.hex)}
    triangle='hide'>
  </GithubPicker>

ColorPicker.propTypes = {
  onChange: PropTypes.func
}

ColorPicker.defaultProps = {
  onChange: noop
}

export default ColorPicker
