import './FeedEditForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, ConfirmButton, FeedFetchErrors, Icon, Input, withValidations} from '../../components'

export const FeedTitleInput = withValidations(Input)
export const FeedUrlInput = withValidations(Input)

export class FeedEditForm extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }),
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    onSaveFormData: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      title: props.data.title,
      url: props.data.url
    }
  }

  render() {
    const {
      data,
      validations,
      changePending,
      onSaveFormData,
      onRemove
    } = this.props

    const {
      title,
      url
    } = this.state

    return (
      <div
        className='my-feed-edit-form'
      >
        <form>
          <FeedTitleInput
            name='title'
            value={title}
            label='Title'
            disabled={changePending}
            validations={validations}
            onChange={({target: {value}}) => this.setState({title: value})}
          />

          <div
            className='my-feed-edit-form__origin'
          >
            <FeedUrlInput
              name='url'
              value={url}
              label='Url'
              disabled={changePending}
              validations={validations}
              onChange={({target: {value}}) => this.setState({url: value})}
            />

            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Icon
                type='link'
              />
            </a>
          </div>

          <div
            className='my-feed-edit-form__buttons'
          >
            <Button
              disabled={changePending}
              onClick={() => onSaveFormData({...data, ...this.state})}
              primary>
              Save
            </Button>

            <ConfirmButton
              disabled={changePending}
              onClick={() => onRemove(data.uuid)}
              caution>
              Delete
            </ConfirmButton>
          </div>
        </form>

        <h2
          className='my-feed-edit-form__fetch-error-title'
        >
          Fetch errors
        </h2>
        <FeedFetchErrors
          uuid={data.uuid}
        />
      </div>
    )
  }
}
