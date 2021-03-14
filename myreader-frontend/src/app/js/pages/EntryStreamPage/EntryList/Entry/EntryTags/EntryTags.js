import React from 'react'
import PropTypes from 'prop-types'
import {Chips} from '../../../../../components/Chips/Chips'

export function EntryTags({tags, onChange}) {

  const onTagAdd = value => {
    if (!tags.includes(value)) {
      onChange([...tags, value])
    }
  }

  const onTagRemove = key => {
    const filteredTags = tags.filter(it => it !== key)
    onChange(filteredTags.length > 0 ? filteredTags : null)
  }

  return (
    <Chips
      keyFn={tag => tag}
      values={tags}
      placeholder='Enter a tag...'
      onAdd={onTagAdd}
      onRemove={onTagRemove}
      renderItem={tag => tag}
    />
  )
}

EntryTags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  onChange: PropTypes.func.isRequired
}
