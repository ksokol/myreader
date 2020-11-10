import React, {useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {FeedEditForm} from '../../components/FeedEditForm/FeedEditForm'
import {ADMIN_FEEDS_URL} from '../../constants'
import {toast} from '../../components/Toast'
import {useFeed} from './feeds'

export function FeedEditPage() {
  const {uuid} = useParams()
  const history = useHistory()

  const {
    feed,
    loading,
    updated,
    deleted,
    validations,
    lastError,
    loadFeed,
    saveFeed,
    deleteFeed,
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

  useEffect(() => {
    if (updated) {
      toast('Feed saved')
    }
  }, [updated])

  useEffect(() => {
    if (deleted) {
      history.replace({pathname: ADMIN_FEEDS_URL})
    }
  }, [deleted, history])

  return feed ? (
    <FeedEditForm
      data={feed}
      changePending={loading}
      validations={validations}
      onSaveFormData={saveFeed}
      onRemove={deleteFeed}
    />
  ) : null
}
