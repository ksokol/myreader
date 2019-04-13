import './SubscriptionEditPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {AutocompleteInput, Button, Chips, ConfirmButton, Icon, Input, withValidations} from '../../components'
import {
  addSubscriptionExclusionPattern,
  deleteSubscription, removeSubscriptionExclusionPattern,
  saveSubscriptionEditForm,
  subscriptionEditFormChangeData,
  subscriptionEditFormSelector,
  subscriptionExclusionPatternsSelector,
  subscriptionTagsSelector
} from '../../store/subscription'
import {bindActionCreators} from 'redux'

const mapStateToProps = state => ({
  ...subscriptionEditFormSelector(state),
  ...subscriptionTagsSelector(state),
  ...subscriptionExclusionPatternsSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  subscriptionEditFormChangeData,
  saveSubscriptionEditForm,
  deleteSubscription,
  removeSubscriptionExclusionPattern,
  addSubscriptionExclusionPattern
}, dispatch)

export const SubscriptionTitleInput = withValidations(Input)

const SubscriptionEditPage = props => {
  if (!props.data) {
    return null
  }

  const {
    data,
    subscriptionTags,
    exclusions,
    validations,
    changePending,
    subscriptionEditFormChangeData,
    addSubscriptionExclusionPattern,
    removeSubscriptionExclusionPattern,
    saveSubscriptionEditForm,
    deleteSubscription
  } = props

  return (
    <form
      className='my-subscription-edit-page'
    >
      <SubscriptionTitleInput
        name='title'
        value={data.title}
        label='Title'
        disabled={changePending}
        validations={validations}
        onChange={event => subscriptionEditFormChangeData({...data, title: event.target.value})}
      />

      <div
        className='my-subscription-edit-page__origin'
      >
        <Input
          name='origin'
          value={data.origin}
          label='Url'
          disabled={true}
        />

        <a
          href={data.origin}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Icon
            type='link'
          />
        </a>
      </div>

      <AutocompleteInput
        name='tag'
        label='Tag'
        disabled={changePending}
        value={data.feedTag.name}
        values={subscriptionTags.map(it => it.name)}
        onSelect={name => subscriptionEditFormChangeData({...data, feedTag: {...data.feedTag, name}})}
      />

      <h2
        className='my-subscription-edit-page__pattern-title'>
        Patterns to ignore
      </h2>

      <Chips
        keyFn={itemProps => itemProps.uuid}
        values={exclusions}
        placeholder='Enter an exclusion pattern'
        disabled={changePending}
        renderItem={itemProps =>
          <React.Fragment>
            <strong>{itemProps.pattern}</strong>
            &nbsp;
            <em>({itemProps.hitCount})</em>
          </React.Fragment>
        }
        onAdd={tag => addSubscriptionExclusionPattern(data.uuid, tag)}
        onRemove={({uuid}) => removeSubscriptionExclusionPattern(data.uuid, uuid)}
      />

      <div
        className='my-subscription-edit-page__buttons'
      >
        <Button
          disabled={changePending}
          onClick={() => saveSubscriptionEditForm(data)}
          primary>
          Save
        </Button>

        <ConfirmButton
          disabled={changePending}
          onClick={() => deleteSubscription(data.uuid)}
          caution>
          Delete
        </ConfirmButton>
      </div>
    </form>
  )
}

SubscriptionEditPage.propTypes = {
  data: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    feedTag: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  subscriptionTags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired
    })
  ),
  exclusions: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      pattern: PropTypes.string.isRequired,
      hitCount: PropTypes.number.isRequired,
    })
  ),
  validations: PropTypes.any,
  changePending: PropTypes.bool.isRequired,
  subscriptionEditFormChangeData: PropTypes.func.isRequired,
  addSubscriptionExclusionPattern: PropTypes.func.isRequired,
  removeSubscriptionExclusionPattern: PropTypes.func.isRequired,
  saveSubscriptionEditForm: PropTypes.func.isRequired,
  deleteSubscription: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionEditPage)
