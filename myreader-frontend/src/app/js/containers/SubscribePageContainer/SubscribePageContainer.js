import React from 'react'
import {connect} from 'react-redux'
import {saveSubscribeEditForm, subscriptionEditFormChangeData, subscriptionEditFormSelector} from '../../store'
import {SubscribePage} from '../../pages'

const mapStateToProps = state => ({
  ...subscriptionEditFormSelector(state)
})

const mapDispatchToProps = dispatch => ({
  onChangeFormData: data => dispatch(subscriptionEditFormChangeData(data)),
  onSaveFormData: data => dispatch(saveSubscribeEditForm(data))
})

const SubscribePageContainer = props => <SubscribePage {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribePageContainer)
