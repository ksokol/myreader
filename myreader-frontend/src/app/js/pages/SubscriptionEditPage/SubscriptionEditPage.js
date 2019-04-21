import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {SubscriptionEditForm} from '../../components'
import {
  addSubscriptionExclusionPattern,
  clearSubscriptionEditForm,
  deleteSubscription,
  fetchSubscriptionExclusionPatterns,
  loadSubscriptionIntoEditForm,
  removeSubscriptionExclusionPattern,
  saveSubscriptionEditForm,
  subscriptionEditFormChangeData,
  subscriptionEditFormSelector,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store'

const mapStateToProps = (state, ownProps) => ({
  ...subscriptionEditFormSelector(state),
  ...subscriptionTagsSelector(state),
  ...subscriptionExclusionPatternsSelector(ownProps.match.params.uuid)(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  subscriptionEditFormChangeData,
  saveSubscriptionEditForm,
  deleteSubscription,
  removeSubscriptionExclusionPattern,
  addSubscriptionExclusionPattern,
  clearSubscriptionEditForm,
  loadSubscriptionIntoEditForm,
  fetchSubscriptionExclusionPatterns
}, dispatch)

class SubscriptionEditPage extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    clearSubscriptionEditForm: PropTypes.func.isRequired,
    loadSubscriptionIntoEditForm: PropTypes.func.isRequired,
    fetchSubscriptionExclusionPatterns: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {uuid} = this.props.match.params
    this.props.clearSubscriptionEditForm()
    this.props.loadSubscriptionIntoEditForm(uuid)
    this.props.fetchSubscriptionExclusionPatterns(uuid)
  }

  render() {
    return this.props.data ? (
      <SubscriptionEditForm
        {...this.props}
      />
    ) : null
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubscriptionEditPage)
)
