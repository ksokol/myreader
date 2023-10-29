import './EntryContent.css'
import React from 'react'

export function EntryContent({content, visible}) {
  return visible ? (
    <div
      className='my-entry-content'
      dangerouslySetInnerHTML={{__html: content}}
    />
  ) : null
}
