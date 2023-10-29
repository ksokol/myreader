import React from 'react'
import {Chips} from '../../../components/Chips/Chips'

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
