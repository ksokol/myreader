import {useCallback, useReducer} from 'react'
import {subscriptionApi, subscriptionTagsApi} from '../../api'

function reducer(state, action) {
  switch(action.type) {
  case 'set_subscription': {
    return {
      ...state,
      updated: false,
      subscription: action.subscription,
      subscriptionTags: action.subscriptionTags,
    }
  }
  case 'update_subscription': {
    return {
      ...state,
      updated: true,
      subscription: action.subscription,
    }
  }
  case 'delete_subscription': {
    return {
      ...state,
      updated: false,
      deleted: true,
      subscription: null,
    }
  }
  case 'loading': {
    return {
      ...state,
      updated: false,
      error: null,
      validations: [],
      loading: true,
    }
  }
  case 'loaded': {
    return {
      ...state,
      loading: false,
    }
  }
  case 'error': {
    const error = action.error
    if (error.status === 400) {
      return error.data && Array.isArray(error.data.errors) ? {
        ...state,
        lastError: null,
        validations: error.data.errors,
      } : {
        ...state,
        lastError: error,
        validations: [],
      }
    } else {
      return {
        ...state,
        lastError: error,
      }
    }
  }
  default: {
    return state
  }
  }
}

export function useSubscription() {
  const [state, dispatch] = useReducer(reducer, {
    subscription: null,
    subscriptionTags: [],
    validations: [],
    updated: false,
    deleted: false,
    loading: false,
    lastError: null,
  })

  const loadSubscription = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      const subscription = await subscriptionApi.fetchSubscription(uuid)
      const subscriptionTags = await subscriptionTagsApi.fetchSubscriptionTags()
      dispatch({type: 'set_subscription', subscription, subscriptionTags})
    } catch(error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const saveSubscription = useCallback(async subscription => {
    dispatch({type: 'loading'})

    try {
      const saved = await subscriptionApi.saveSubscription(subscription)
      dispatch({type: 'update_subscription', subscription: saved})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const deleteSubscription = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      await subscriptionApi.deleteSubscription(uuid)
      dispatch({type: 'delete_subscription'})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  return {
    subscription: state.subscription,
    subscriptionTags: state.subscriptionTags,
    loading: state.loading,
    updated: state.updated,
    deleted: state.deleted,
    lastError: state.lastError,
    validations: state.validations,
    loadSubscription,
    saveSubscription,
    deleteSubscription,
  }
}
