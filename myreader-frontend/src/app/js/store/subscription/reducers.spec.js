import initialState from '.'
import {subscriptionReducers} from '../../store'

describe('subscription reducer', () => {

  let state

  beforeEach(() => state = initialState())

  it('initial state', () => {
    expect(subscriptionReducers(state, {type: 'UNKNOWN_ACTION'})).toEqual(state)
  })

  describe('action SUBSCRIPTIONS_RECEIVED', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'SUBSCRIPTIONS_RECEIVED',
        subscriptions: [1]
      }
    })

    it('should set subscriptions', () => {
      const expectedState = {subscriptions: [1]}

      expect(subscriptionReducers(state, action)).toContainObject(expectedState)
    })
  })

  describe('action SECURITY_UPDATE', () => {

    let action

    beforeEach(() => {
      action = {
        type: 'SECURITY_UPDATE',
        authorized: false
      }
    })


    it('should reset state when not authorized', () => {
      const currentState = {other: 'expected'}

      expect(subscriptionReducers(currentState, action)).toContainObject(initialState())
    })

    it('should do nothing when authorized', () => {
      action.authorized = true

      const currentState = {other: 'expected'}
      const expectedState = {other: 'expected'}

      expect(subscriptionReducers(currentState, action)).toContainObject(expectedState)
    })
  })

  describe('action ENTRY_CHANGED', () => {

    let action

    beforeEach(() => {
      state = {
        subscriptions: [{uuid: '1', unseen: 2}, {uuid: '2', unseen: 3}]
      }

      action = {
        type: 'ENTRY_CHANGED'
      }
    })

    it('should decrease unseen count', () => {
      action.newValue = {feedUuid: '1', seen: true}
      action.oldValue = {feedUuid: '1', seen: false}

      expect(subscriptionReducers(state, action))
        .toContainObject({subscriptions: [{uuid: '1', unseen: 1}, {uuid: '2', unseen: 3}]})
    })

    it('should increase unseen count', () => {
      action.newValue = {feedUuid: '1', seen: false}
      action.oldValue = {feedUuid: '1', seen: true}

      expect(subscriptionReducers(state, action))
        .toContainObject({subscriptions: [{uuid: '1', unseen: 3}, {uuid: '2', unseen: 3}]})
    })

    it('should do nothing when seen flag not changed', () => {
      action.newValue = {feedUuid: '1', seen: false}
      action.oldValue = {feedUuid: '1', seen: false}

      expect(subscriptionReducers(state, action))
        .toContainObject({subscriptions: [{uuid: '1', unseen: 2}]})
    })

    it('should do nothing when subscription is not available', () => {
      action.newValue = {feedUuid: '3', seen: false}
      action.oldValue = {feedUuid: '3', seen: false}

      expect(subscriptionReducers(state, action))
        .toContainObject({subscriptions: [{uuid: '1', unseen: 2}, {uuid: '2', unseen: 3}]})
    })
  })

  describe('action SUBSCRIPTION_DELETED', () => {

    it('should remove subscription for given uuid', () => {
      const state = {subscriptions: [{uuid: '1'}, {uuid: '2'}, {uuid: '3'}]}
      const action = {type: 'SUBSCRIPTION_DELETED', uuid: '2'}

      expect(subscriptionReducers(state, action)).toContainObject({subscriptions: [{uuid: '1'}, {uuid: '3'}]})
    })
  })

  describe('action SUBSCRIPTION_TAG_CHANGED', () => {

    it('should update every feedTag matching uuid', () => {
      const state = {
        subscriptions: [
          {feedTag: {uuid: '1', name: 'name1', color: null}},
          {feedTag: {uuid: '2', name: 'name2', color: 'color2'}},
          {feedTag: {uuid: '1', name: 'name1', color: null}}
        ]
      }

      const expectedState = {
        subscriptions: [
          {feedTag: {uuid: '1', name: 'expected name1', color: 'expected color1'}},
          {feedTag: {uuid: '2', name: 'name2', color: 'color2'}},
          {feedTag: {uuid: '1', name: 'expected name1', color: 'expected color1'}}
        ]
      }

      const action = {
        type: 'SUBSCRIPTION_TAG_CHANGED',
        subscriptionTag: {uuid: '1', name: 'expected name1', color: 'expected color1'}
      }

      expect(subscriptionReducers(state, action)).toEqual(expectedState)
    })
  })
})
