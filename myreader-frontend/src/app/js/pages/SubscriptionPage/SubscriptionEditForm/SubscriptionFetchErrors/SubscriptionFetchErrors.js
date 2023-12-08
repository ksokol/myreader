import React from 'react'
import {TimeAgo} from '../../../../components/TimeAgo/TimeAgo'

export function SubscriptionFetchErrors({fetchErrors}) {
  return fetchErrors.length > 0 ? (
    <>
      <h2>Fetch errors</h2>
      <div className='my-subscription-fetch-errors'>
        {fetchErrors.map(item => (
          <div
            key={item.uuid}
          >
            <span>{item.message}</span>
            <span><TimeAgo date={item.createdAt}/></span>
          </div>
        ))}
      </div>
    </>
  ) : null
}
