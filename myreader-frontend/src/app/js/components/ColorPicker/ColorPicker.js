import React from 'react'
import PropTypes from 'prop-types'
import iro from '@jaames/iro'
import {noop} from '../../shared/utils'

const changeEventName = 'color:change'

class ColorPicker extends React.Component {

  constructor(props) {
    super(props)

    this.myRef = React.createRef()
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    const {color} = this.props
    this.colorPicker = new iro.ColorPicker(this.myRef.current, {color})
    this.colorPicker.on(changeEventName, this.onChange)
  }

  componentWillUnmount() {
    this.colorPicker.off(changeEventName, this.onChange)
  }

  onChange(color) {
    this.props.onChange(color.hexString)
  }

  render() {
    return <div ref={this.myRef} />
  }
}

ColorPicker.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func
}

ColorPicker.defaultProps = {
  onChange: noop
}

export default ColorPicker
