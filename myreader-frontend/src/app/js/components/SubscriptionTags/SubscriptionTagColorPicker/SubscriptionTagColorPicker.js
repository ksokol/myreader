import React from 'react'
import PropTypes from 'prop-types'
import Badge from '../../Badge/Badge'
import {Button} from '../../Buttons'
import ColorPicker from '../../ColorPicker/ColorPicker'
import Dialog from '../../Dialog/Dialog'

export class SubscriptionTagColorPicker extends React.Component {

  static propTypes = {
    tag: PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
    }),
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    currentColor: undefined
  }

  static getDerivedStateFromProps(props, state) {
    return {
      currentColor: state.currentColor || props.tag.color
    }
  }

  onChangeColor = color => this.setState({currentColor: color})

  onClickSaveButton = () => {
    if (this.state.currentColor !== this.props.tag.color) {
      this.props.onSave(this.state.currentColor)
    }
    this.props.onClose()
  }

  render() {
    const {
      currentColor
    } = this.state

    const {
      tag,
      onClose
    } = this.props

    const header = <Badge text={tag.name} color={currentColor} />
    const body = <ColorPicker color={tag.color} onChange={this.onChangeColor} />
    const footer = <Button onClick={this.onClickSaveButton} primary>save</Button>

    return (
      <Dialog header={header}
              body={body}
              footer={footer}
              onClickClose={onClose}>
      </Dialog>
    )
  }
}
