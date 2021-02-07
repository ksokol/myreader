import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {FeedEditForm} from '../../components/FeedEditForm/FeedEditForm'
import {toast} from '../../components/Toast'
import {useFeed} from './feeds'

export function FeedEditPage() {
  const {uuid} = useParams()

  const {
    feed,
    lastError,
    loadFeed,
  } = useFeed()

  useEffect(() => {
    if (uuid) {
      loadFeed(uuid)
    }
  }, [loadFeed, uuid])

  useEffect(() => {
    if (lastError) {
      toast(lastError.data, {error: true})
    }
  }, [lastError])

  return feed ? (
    <FeedEditForm
      data={feed}
    />
  ) : null
}
