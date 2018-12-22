import './AutocompleteInput.css'
import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import {Input} from '..'

const AutocompleteInput = props => {
  const {
    name,
    value,
    values,
    onSelect,
    ...inputProps
  } = props

  return(
    <Downshift
      id={name}
      selectedItem={value ? value : ''}
      onInputValueChange={inputValue => onSelect(inputValue.length > 0 ? inputValue : null)}
    >
      {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex
        }) => (
        <div className='my-autocomplete-input'>
          <Input {...getInputProps({...inputProps, name})} />
          <ul {...getMenuProps({className: 'my-autocomplete-input__dropdown'})}>
            {isOpen ?
              values
                .filter(item => item.startsWith(inputValue))
                .map((item, index) => (
                  <li
                    key={item}
                    {...getItemProps({
                      index,
                      item,
                      className: highlightedIndex === index ? 'my-autocomplete-input__item--selected' : null
                    })}
                  >
                    {item.startsWith(inputValue) ?
                      <React.Fragment>
                        <span className='my-autocomplete-input__item--highlight'>{inputValue}</span>
                        {item.replace(inputValue, '')}
                      </React.Fragment> :
                      item
                    }
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  )
}

AutocompleteInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool
}

export default AutocompleteInput
