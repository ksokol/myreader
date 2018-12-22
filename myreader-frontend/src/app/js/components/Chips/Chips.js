import './Chips.css'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Chip from './Chip'
import {Hotkeys, Input} from '..'

class Chips extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      inputValue: ''
    }

    this.onChangeInput = this.onChangeInput.bind(this)
    this.onKeyEnter = this.onKeyEnter.bind(this)

    this.onKeys = {
      enter: this.onKeyEnter
    }
  }

  onChangeInput(event) {
    this.setState({inputValue: event.target.value})
  }

  onKeyEnter() {
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
      <div className={classNames('my-chips', className)}>
        <div>
          {values.map(value =>
            <Chip key={keyFn(value)}
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

        {onAdd &&
          <Hotkeys onKeys={this.onKeys}>
              <Input name='chip-input'
                     placeholder={placeholder}
                     value={this.state.inputValue}
                     disabled={disabled}
                     onChange={this.onChangeInput}/>
            </Hotkeys>
        }
      </div>
    )
  }
}

Chips.propTypes = {
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

Chips.defaultProps = {
  values: [],
  disabled: false
}

export default Chips
