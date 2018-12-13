import './ConfirmButton.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '..'

class ConfirmButton extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      presentConfirmation: false
    }

    this.onClickButton = this.onClickButton.bind(this)
    this.onClickConfirm = this.onClickConfirm.bind(this)
    this.onClickReject = this.onClickReject.bind(this)
  }

  onClickButton() {
    this.setState({presentConfirmation: true})
  }

  onClickConfirm() {
    this.setState({presentConfirmation: false})
    this.props.onClick()
  }

  onClickReject() {
    this.setState({presentConfirmation: false})
  }

  render() {
    const {
      disabled,
      children,
      ...buttonProps
    } = this.props

    return this.state.presentConfirmation ?
      <React.Fragment>
        <Button className='my-confirm-button__confirm'
                onClick={this.onClickConfirm}
                disabled={disabled}
                caution>Yes
        </Button>
        <Button className='my-confirm-button__reject'
                onClick={this.onClickReject}
                disabled={disabled}
                primary>No
        </Button>
      </React.Fragment> :
      <Button {...buttonProps}
              disabled={disabled}
              onClick={this.onClickButton}>{children}
      </Button>
  }
}

ConfirmButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

ConfirmButton.defaultProps = {
  disabled: false
}

export default ConfirmButton
