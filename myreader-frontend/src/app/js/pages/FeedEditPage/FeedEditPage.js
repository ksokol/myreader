import './FeedEditPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, ConfirmButton, FeedFetchErrors, Icon, Input, withValidations} from '../../components'

export const FeedTitleInput = withValidations(Input)
export const FeedUrlInput = withValidations(Input)

const FeedEditPage = props => {
  if (!props.data) {
    return null
  }

  const {
    data,
    failures,
    links,
    fetchFailuresLoading,
    validations,
    changePending,
    onChangeFormData,
    onSaveFormData,
    onRemove,
    onMore
  } = props

  return (
    <div className='my-feed-edit-page'>
      <form>
        <FeedTitleInput name='title'
                        value={data.title}
                        label='Title'
                        disabled={changePending}
                        validations={validations}
                        onChange={event => onChangeFormData({...data, title: event.target.value})}
        />

        <div className='my-feed-edit-page__origin'>
          <FeedUrlInput name='url'
                        value={data.url}
                        label='Url'
                        disabled={changePending}
                        validations={validations}
                        onChange={event => onChangeFormData({...data, url: event.target.value})}
          />

          <a href={data.url} target='_blank' rel='noopener noreferrer'>
            <Icon type='link' />
          </a>
        </div>

        <div className='my-feed-edit-page__buttons'>
          <Button disabled={changePending}
                  onClick={() => onSaveFormData(data)}
                  primary>Save
          </Button>

          <ConfirmButton disabled={changePending}
                         onClick={() => onRemove(data.uuid)}
                         caution>Delete
          </ConfirmButton>
        </div>
      </form>

      <h2 className='my-feed-edit-page__fetch-error-title'>Fetch errors</h2>
      <FeedFetchErrors failures={failures}
                       links={links}
                       loading={fetchFailuresLoading}
                       onMore={onMore} />
    </div>
  )
}

FeedEditPage.propTypes = {
  data: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }),
  validations: PropTypes.any,
  failures: PropTypes.any,
  links: PropTypes.any,
  changePending: PropTypes.bool.isRequired,
  fetchFailuresLoading: PropTypes.bool.isRequired,
  onChangeFormData: PropTypes.func.isRequired,
  onSaveFormData: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired
}

export default FeedEditPage
