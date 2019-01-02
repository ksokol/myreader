import React from 'react'
import {connect} from 'react-redux'
import {
  addSubscriptionExclusionPattern,
  deleteSubscription,
  removeSubscriptionExclusionPattern,
  saveSubscriptionEditForm,
  subscriptionEditFormChangeData,
  subscriptionEditFormSelector,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store'
import {SubscriptionEditPage} from '../../pages'

const mapStateToProps = state => ({
  ...subscriptionEditFormSelector(state),
  ...subscriptionTagsSelector(state),
  ...subscriptionExclusionPatternsSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onChangeFormData: data => dispatch(subscriptionEditFormChangeData(data)),
  onSaveFormData: data => dispatch(saveSubscriptionEditForm(data)),
  onRemoveSubscription: subscriptionUuid => dispatch(deleteSubscription(subscriptionUuid)),
  onRemoveExclusionPattern: (subscriptionUuid, uuid) => dispatch(removeSubscriptionExclusionPattern(subscriptionUuid, uuid)),
  onAddExclusionPattern: (subscriptionUuid, value) => dispatch(addSubscriptionExclusionPattern(subscriptionUuid, value))
})

const SubscriptionEditPageContainer = props => <SubscriptionEditPage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionEditPageContainer)
