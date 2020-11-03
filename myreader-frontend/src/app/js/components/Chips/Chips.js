import './Chips.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Chip} from './Chip'
import {Input} from '../Input/Input'

export class Chips extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    keyFn: PropTypes.func.isRequired,
    values: PropTypes.arrayOf(PropTypes.any),
    selected: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    renderItem: PropTypes.func.isRequired
  }

  static defaultProps = {
    values: [],
    disabled: false
  }

  state = {
    inputValue: ''
  }

  onChangeInput = event => {
    this.setState({inputValue: event.target.value})
  }

  onEnter = () => {
    if (this.state.inputValue.length > 0) {
      this.props.onAdd(this.state.inputValue)
    }
    this.setState({inputValue: ''})
  }

  render() {
    const {
      className,
      keyFn,
      values,
      placeholder,
      selected,
      disabled,
      onSelect,
      onRemove,
      onAdd,
      renderItem
    } = this.props

    return (
      <div
        className={`my-chips ${className || ''}`}
      >
        <div>
          {values.map(value =>
            <Chip
              key={keyFn(value)}
              keyFn={() => keyFn(value)}
              value={value}
              onSelect={onSelect}
              onRemove={onRemove}
              selected={selected}
              disabled={disabled}>
              {renderItem(value)}
            </Chip>
          )}
        </div>

        {onAdd && (
          <Input
            name='chip-input'
            placeholder={placeholder}
            value={this.state.inputValue}
            disabled={disabled}
            onChange={this.onChangeInput}
            onEnter={this.onEnter}
          />)
        }
      </div>
    )
  }
}
