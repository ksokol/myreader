import './SubscribeForm.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '../../components/Buttons'
import {Input} from '../../components/Input/Input'

class SubscribeForm extends React.Component {

  static propTypes = {
    validations: PropTypes.any,
    changePending: PropTypes.bool.isRequired,
    saveSubscribeEditForm: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      origin: ''
    }
  }

  render() {
    const {
      validations,
      changePending,
      saveSubscribeEditForm
    } = this.props

    const {
      origin
    } = this.state

    return (
      <form
        className='my-subscribe-form'
      >
        <Input
          name='origin'
          value={origin}
          label='Url'
          disabled={changePending}
          validations={validations}
          onChange={event => this.setState({origin: event.target.value})}
        />

        <div
          className='my-subscribe-form__buttons'
        >
          <Button
            disabled={changePending}
            onClick={() => saveSubscribeEditForm({origin})}
            primary>Subscribe
          </Button>
        </div>
      </form>
    )
  }
}

export default SubscribeForm
