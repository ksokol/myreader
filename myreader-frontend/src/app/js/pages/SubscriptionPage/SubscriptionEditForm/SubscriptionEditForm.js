import './SubscriptionEditForm.css'
import {useState} from 'react'
import PropTypes from 'prop-types'
import {AutocompleteInput} from '../../../components/AutocompleteInput/AutocompleteInput'
import {Button, ConfirmButton} from '../../../components/Buttons'
import {Icon} from '../../../components/Icon/Icon'
import {Input} from '../../../components/Input/Input'
import {SubscriptionExclusions} from './SubscriptionExclusions'
import {SubscriptionFetchErrors} from './SubscriptionFetchErrors/SubscriptionFetchErrors'
import {SubscriptionColorPicker} from './SubscriptionColorPicker'
import {Checkbox} from '../../../components/Checkbox/Checkbox'

export function SubscriptionEditForm(props) {
  const [state, setState] = useState({
    title: props.data.title,
    origin: props.data.origin,
    tag: props.data.tag,
    color: props.data.color,
    stripImages: props.data.stripImages,
    showDialog: false,
  })

  const onSaveSubscription = () => {
    props.saveSubscriptionEditForm({
      ...props.data,
      title: state.title,
      origin: state.origin,
      tag: state.tag,
      color: state.color,
      stripImages: state.stripImages,
    })
  }

  const {
    data,
    subscriptionTags,
    exclusionPatterns,
    fetchErrors,
    validations,
    changePending,
    deleteSubscription,
    addExclusionPattern,
    removeExclusionPattern
  } = props

  return (
    <>
      <form
        className='my-subscription-edit-form'
      >
        <Input
          name='title'
          value={state.title}
          label='Title'
          disabled={changePending}
          validations={validations}
          onChange={({target: {value}}) => setState(currentState => ({...currentState, title: value}))}
        />

        <div
          className='my-subscription-edit-form__row'
        >
          <Input
            name='origin'
            value={state.origin}
            label='Url'
            disabled={changePending}
            validations={validations}
            onChange={({target: {value}}) => setState(currentState => ({...currentState, origin: value}))}
          />

          <a
            href={state.origin}
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
            value={state.tag}
            values={subscriptionTags}
            onSelect={selectedTag => setState(currentState => ({...currentState, tag: selectedTag}))}
          />
          <button
            className='my-subscription-edit-form__color'
            style={{backgroundColor: state.color}}
            type='button'
            role='color-picker-button'
            onClick={() => setState(currentState => ({...currentState, showDialog: true}))}
          />
          {state.showDialog && (
            <SubscriptionColorPicker
              color={state.color}
              onSelect={selectedColor => setState(currentState => ({...currentState, color: selectedColor}))}
              onClose={() => setState(currentState => ({...currentState, showDialog: false}))}
            />
          )}
        </div>

        <div
          className='my-subscription-edit-form__row'
        >
          <Checkbox
            name='stripImages'
            value={state.stripImages}
            disabled={changePending}
            onChange={() => setState(current => ({...current, stripImages: !current.stripImages}))}
          >
            strip images
          </Checkbox>
        </div>

        <h2
          className='my-subscription-edit-form__pattern-title'>
          Patterns to ignore
        </h2>

        <SubscriptionExclusions
          disabled={changePending}
          exclusionPatterns={exclusionPatterns}
          addExclusionPattern={addExclusionPattern}
          removeExclusionPattern={removeExclusionPattern}
        />

        <div
          className='my-subscription-edit-form__buttons'
        >
          <Button
            disabled={changePending}
            onClick={onSaveSubscription}
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
      <SubscriptionFetchErrors
        fetchErrors={fetchErrors}
      />
    </>
  )
}

SubscriptionEditForm.propTypes = {
  data: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    tag: PropTypes.string,
    color: PropTypes.string,
    stripImages: PropTypes.bool.isRequired,
  }),
  subscriptionTags: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  exclusionPatterns: PropTypes.array.isRequired,
  fetchErrors: PropTypes.array.isRequired,
  validations: PropTypes.any,
  changePending: PropTypes.bool.isRequired,
  saveSubscriptionEditForm: PropTypes.func.isRequired,
  deleteSubscription: PropTypes.func.isRequired,
  addExclusionPattern: PropTypes.func.isRequired,
  removeExclusionPattern: PropTypes.func.isRequired,
}
