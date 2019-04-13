import './SubscribePage.css'
import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Button, Input, withValidations} from '../../components'
import {
  saveSubscribeEditForm,
  subscriptionEditFormChangeData,
  subscriptionEditFormSelector
} from '../../store'

const mapStateToProps = state => ({
  ...subscriptionEditFormSelector(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  onChangeFormData: subscriptionEditFormChangeData,
  onSaveFormData: saveSubscribeEditForm
}, dispatch)

export const SubscribeOriginInput = withValidations(Input)

const SubscribePage = props => {
  const {
    data,
    validations,
    changePending,
    onChangeFormData,
    onSaveFormData
  } = props

  return (
    <form className='my-subscribe-page'>
      <SubscribeOriginInput name='origin'
                            value={data ? data.origin : ''}
                            label='Url'
                            disabled={changePending}
                            validations={validations}
                            onChange={event => onChangeFormData({origin: event.target.value})}
      />

      <div className='my-subscribe-page__buttons'>
        <Button disabled={changePending}
                onClick={() => onSaveFormData({...data})}
                primary>Subscribe
        </Button>
      </div>
    </form>
  )
}

SubscribePage.propTypes = {
  data: PropTypes.shape({
    origin: PropTypes.string
  }),
  validations: PropTypes.any,
  changePending: PropTypes.bool.isRequired,
  onChangeFormData: PropTypes.func.isRequired,
  onSaveFormData: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribePage)
