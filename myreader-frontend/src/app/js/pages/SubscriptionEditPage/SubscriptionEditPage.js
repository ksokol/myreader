import './SubscriptionEditPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {AutocompleteInput, Button, Chips, ConfirmButton, Icon, Input, withValidations} from '../../components'

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
    onChangeFormData,
    onAddExclusionPattern,
    onRemoveExclusionPattern,
    onSaveFormData,
    onRemoveSubscription
  } = props

  return (
    <form className='my-subscription-edit-page'>
      <SubscriptionTitleInput name='title'
                              value={data.title}
                              label='Title'
                              disabled={changePending}
                              validations={validations}
                              onChange={event => onChangeFormData({...data, title: event.target.value})}
      />

      <div className='my-subscription-edit-page__origin'>
        <Input name='origin'
               value={data.origin}
               label='Url'
               disabled={true}
        />

        <a href={data.origin} target='_blank' rel='noopener noreferrer'>
          <Icon type='link' />
        </a>
      </div>

      <AutocompleteInput name='tag'
                         label='Tag'
                         disabled={changePending}
                         value={data.feedTag.name}
                         values={subscriptionTags.map(it => it.name)}
                         onSelect={name => onChangeFormData({...data, feedTag: {...data.feedTag, name}})}
      />

      <h2 className='my-subscription-edit-page__pattern-title'>Patterns to ignore</h2>

      <Chips keyFn={itemProps => itemProps.uuid}
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
             onAdd={tag => onAddExclusionPattern(data.uuid, tag)}
             onRemove={({uuid}) => onRemoveExclusionPattern(uuid)}
      />

      <div className='my-subscription-edit-page__buttons'>
        <Button disabled={changePending}
                onClick={() => onSaveFormData(data)}
                primary>Save
        </Button>

        <ConfirmButton disabled={changePending}
                       onClick={() => onRemoveSubscription(data.uuid)}
                       caution>Delete
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
  onChangeFormData: PropTypes.func.isRequired,
  onAddExclusionPattern: PropTypes.func.isRequired,
  onRemoveExclusionPattern: PropTypes.func.isRequired,
  onSaveFormData: PropTypes.func.isRequired,
  onRemoveSubscription: PropTypes.func.isRequired
}

export default SubscriptionEditPage
