import {useCallback, useReducer} from 'react'
import {api} from '../../api'

function reducer(state, action) {
  switch(action.type) {
  case 'set_subscription': {
    return {
      ...state,
      updated: false,
      subscription: action.subscription,
      subscriptionTags: action.subscriptionTags,
      exclusionPatterns: action.exclusionPatterns,
      fetchErrors: action.fetchErrors,
    }
  }
  case 'update_subscription': {
    return {
      ...state,
      updated: true,
      subscription: action.subscription,
    }
  }
  case 'update_exclusion_patterns': {
    return {
      ...state,
      updated: true,
      exclusionPatterns: action.exclusionPatterns,
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
    exclusionPatterns: [],
    fetchErrors: [],
    validations: [],
    updated: false,
    deleted: false,
    loading: false,
    lastError: null,
  })

  const loadSubscription = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      const {subscription, tags: subscriptionTags, exclusionPatterns, fetchErrors} = await api.get({
        url: `views/SubscriptionPage/${uuid}`,
      })
      dispatch({type: 'set_subscription', subscription, subscriptionTags, exclusionPatterns, fetchErrors})
    } catch(error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const saveSubscription = useCallback(async subscription => {
    dispatch({type: 'loading'})

    try {
      const response = await api.patch({
        url: `views/SubscriptionPage/${subscription.uuid}/subscription`,
        method: 'PATCH',
        body: subscription,
      })
      dispatch({type: 'update_subscription', subscription: response.subscription})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const deleteSubscription = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      await api.delete({
        url: `views/SubscriptionPage/${uuid}/subscription`,
      })
      dispatch({type: 'delete_subscription'})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [])

  const addExclusionPattern = useCallback(async pattern => {
    dispatch({type: 'loading'})

    try {
      const {exclusionPatterns} = await api.post({
        url: `views/SubscriptionPage/${state.subscription.uuid}/exclusionPatterns`,
        body: {pattern},
      })
      dispatch({type: 'update_exclusion_patterns', exclusionPatterns})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [state.subscription])

  const removeExclusionPattern = useCallback(async uuid => {
    dispatch({type: 'loading'})

    try {
      const {exclusionPatterns} = await api.delete({
        url: `views/SubscriptionPage/${state.subscription.uuid}/exclusionPatterns/${uuid}`,
      })
      dispatch({type: 'update_exclusion_patterns', exclusionPatterns})
    } catch (error) {
      dispatch({type: 'error', error})
    } finally {
      dispatch({type: 'loaded'})
    }
  }, [state.subscription])

  return {
    subscription: state.subscription,
    subscriptionTags: state.subscriptionTags,
    exclusionPatterns: state.exclusionPatterns,
    fetchErrors: state.fetchErrors,
    loading: state.loading,
    updated: state.updated,
    deleted: state.deleted,
    lastError: state.lastError,
    validations: state.validations,
    loadSubscription,
    saveSubscription,
    deleteSubscription,
    addExclusionPattern,
    removeExclusionPattern,
  }
}
