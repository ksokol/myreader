import './SubscriptionEditForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {AutocompleteInput} from '../AutocompleteInput/AutocompleteInput'
import {Button, ConfirmButton} from '../Buttons'
import {Icon} from '../Icon/Icon'
import {Input, withValidations} from '../Input'
import {SubscriptionExclusions} from './SubscriptionExclusions/SubscriptionExclusions'

export const SubscriptionTitleInput = withValidations(Input)

class SubscriptionEditForm extends React.Component {

  static propTypes = {
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
    exclusions: PropTypes.array,
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    addSubscriptionExclusionPattern: PropTypes.func.isRequired,
    removeSubscriptionExclusionPattern: PropTypes.func.isRequired,
    saveSubscriptionEditForm: PropTypes.func.isRequired,
    deleteSubscription: PropTypes.func.isRequired
  }

  state = {
    title: this.props.data.title,
    name: this.props.data.feedTag.name
  }

  onSaveSubscription = () => {
    this.props.saveSubscriptionEditForm({
      ...this.props.data,
      title: this.state.title,
      feedTag: {
        ...this.props.data.feedTag,
        name: this.state.name
      }
    })
  }

  render() {
    const {
      data,
      subscriptionTags,
      exclusions,
      validations,
      changePending,
      addSubscriptionExclusionPattern,
      removeSubscriptionExclusionPattern,
      deleteSubscription
    } = this.props

    const {
      title,
      name
    } = this.state

    return (
      <form
        className='my-subscription-edit-form'
      >
        <SubscriptionTitleInput
          name='title'
          value={title}
          label='Title'
          disabled={changePending}
          validations={validations}
          onChange={({target: {value}}) => this.setState({title: value})}
        />

        <div
          className='my-subscription-edit-form__origin'
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
          value={name}
          values={subscriptionTags.map(it => it.name)}
          onSelect={name => this.setState({name})}
        />

        <h2
          className='my-subscription-edit-form__pattern-title'>
          Patterns to ignore
        </h2>

        <SubscriptionExclusions
          subscription={data}
          changePending={changePending}
          exclusions={exclusions}
          onAdd={addSubscriptionExclusionPattern}
          onRemove={removeSubscriptionExclusionPattern}
        />

        <div
          className='my-subscription-edit-form__buttons'
        >
          <Button
            disabled={changePending}
            onClick={this.onSaveSubscription}
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
}

export default SubscriptionEditForm
