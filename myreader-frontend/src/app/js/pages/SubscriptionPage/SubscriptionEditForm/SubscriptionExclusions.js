import React from 'react'
import {Chips} from '../../../components/Chips/Chips'
import PropTypes from 'prop-types'

export function SubscriptionExclusions({
  disabled,
  exclusionPatterns,
  addExclusionPattern,
  removeExclusionPattern
}) {
  return (
    <Chips
      keyFn={itemProps => itemProps.uuid}
      values={exclusionPatterns}
      placeholder='Enter an exclusion pattern'
      disabled={disabled}
      renderItem={itemProps =>
        <>
          <strong>{itemProps.pattern}</strong>
          &nbsp;
          <em>({itemProps.hitCount})</em>
        </>
      }
      onAdd={pattern => addExclusionPattern(pattern)}
      onRemove={({uuid}) => removeExclusionPattern(uuid)}
    />
  )
}

SubscriptionExclusions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  exclusionPatterns: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      pattern: PropTypes.string.isRequired,
      hitCount: PropTypes.number.isRequired,
    })
  ).isRequired,
  addExclusionPattern: PropTypes.func.isRequired,
  removeExclusionPattern: PropTypes.func.isRequired
}
