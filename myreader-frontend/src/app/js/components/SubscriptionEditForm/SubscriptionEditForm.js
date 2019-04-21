import './SubscriptionEditForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {AutocompleteInput, Button, Chips, ConfirmButton, Icon, Input, withValidations} from '../../components'

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
    exclusions: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        pattern: PropTypes.string.isRequired,
        hitCount: PropTypes.number.isRequired,
      })
    ),
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    addSubscriptionExclusionPattern: PropTypes.func.isRequired,
    removeSubscriptionExclusionPattern: PropTypes.func.isRequired,
    saveSubscriptionEditForm: PropTypes.func.isRequired,
    deleteSubscription: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      title: props.data.title,
      name: props.data.feedTag.name
    }
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
