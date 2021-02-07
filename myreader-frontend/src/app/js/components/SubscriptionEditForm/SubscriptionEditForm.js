import './SubscriptionEditForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {AutocompleteInput} from '../AutocompleteInput/AutocompleteInput'
import {Button, ConfirmButton} from '../Buttons'
import {Icon} from '../Icon/Icon'
import {Input} from '../Input/Input'
import {SubscriptionExclusions} from './SubscriptionExclusions/SubscriptionExclusions'

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
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    saveSubscriptionEditForm: PropTypes.func.isRequired,
    deleteSubscription: PropTypes.func.isRequired
  }

  state = {
    title: this.props.data.title,
    origin: this.props.data.origin,
    name: this.props.data.feedTag.name
  }

  onSaveSubscription = () => {
    this.props.saveSubscriptionEditForm({
      ...this.props.data,
      title: this.state.title,
      origin: this.state.origin,
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
      validations,
      changePending,
      deleteSubscription
    } = this.props

    const {
      title,
      origin,
      name
    } = this.state

    return (
      <form
        className='my-subscription-edit-form'
      >
        <Input
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
            value={origin}
            label='Url'
            disabled={changePending}
            validations={validations}
            onChange={({target: {value}}) => this.setState({origin: value})}
          />

          <a
            href={origin}
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
