import React from 'react'
import {connect} from 'react-redux'
import {saveSubscriptionTag, subscriptionTagsSelector} from '../../store'
import {SubscriptionTags} from '../../components'

const mapStateToProps = subscriptionTagsSelector

const mapDispatchToProps = dispatch => ({
  onChange: subscriptionTag => dispatch(saveSubscriptionTag(subscriptionTag))
})

const SubscriptionTagsContainer = props => <SubscriptionTags {...props} />

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionTagsContainer)
