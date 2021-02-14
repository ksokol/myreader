import './SubscriptionEditForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {AutocompleteInput} from '../AutocompleteInput/AutocompleteInput'
import {Button, ConfirmButton} from '../Buttons'
import {Icon} from '../Icon/Icon'
import {Input} from '../Input/Input'
import {SubscriptionExclusions} from './SubscriptionExclusions/SubscriptionExclusions'
import {SubscriptionFetchErrors} from './SubscriptionFetchErrors/SubscriptionFetchErrors'
import {SubscriptionColorPicker} from './SubscriptionColorPicker/SubscriptionColorPicker'

class SubscriptionEditForm extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      tag: PropTypes.string,
      color: PropTypes.string,
    }),
    subscriptionTags: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    saveSubscriptionEditForm: PropTypes.func.isRequired,
    deleteSubscription: PropTypes.func.isRequired
  }

  state = {
    title: this.props.data.title,
    origin: this.props.data.origin,
    tag: this.props.data.tag,
    color: this.props.data.color,
    showDialog: false,
  }

  onSaveSubscription = () => {
    this.props.saveSubscriptionEditForm({
      ...this.props.data,
      title: this.state.title,
      origin: this.state.origin,
      tag: this.state.tag,
      color: this.state.color,
    })
  }

  render() {
    const {
      data,
      subscriptionTags,
      validations,
      changePending,
      deleteSubscription,
    } = this.props

    const {
      title,
      origin,
      tag,
      color,
      showDialog,
    } = this.state

    return (
      <>
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
            className='my-subscription-edit-form__row'
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

          <div
            className='my-subscription-edit-form__row'
          >
            <AutocompleteInput
              name='tag'
              label='Tag'
              disabled={changePending}
              value={tag}
              values={subscriptionTags}
              onSelect={tag => this.setState({tag})}
            />
            <button
              className='my-subscription-edit-form__color'
              style={{backgroundColor: color}}
              type='button'
              role='color-picker-button'
              onClick={() => this.setState({showDialog: true})}
            />
            {showDialog && (
              <SubscriptionColorPicker
                color={color}
                onSelect={color => this.setState({color})}
                onClose={() => this.setState({showDialog: false})}
              />
            )}
          </div>

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
        <h2
          className='my-subscription-edit-form__fetch-error-title'
        >
          Fetch errors
        </h2>
        <SubscriptionFetchErrors
          uuid={data.uuid}
        />
      </>
    )
  }
}

export default SubscriptionEditForm
