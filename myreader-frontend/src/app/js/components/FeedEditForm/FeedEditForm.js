import './FeedEditForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {FeedFetchErrors} from '../../components/FeedFetchErrors/FeedFetchErrors'
import {Icon} from '../../components/Icon/Icon'
import {Input} from '../../components/Input/Input'

export class FeedEditForm extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }),
  }

  render() {
    const {
      data,
    } = this.props

    return (
      <div
        className='my-feed-edit-form'
      >
        <Input
          name='title'
          value={data.title}
          label='Title'
          disabled={true}
        />

        <div
          className='my-feed-edit-form__origin'
        >
          <Input
            name='url'
            value={data.url}
            label='Url'
            disabled={true}
          />

          <a
            href={data.url}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Icon
              type='link'
            />
          </a>
        </div>

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
