import './SubscriptionTags.css'
import React from 'react'
import PropTypes from 'prop-types'
import SubscriptionTagColorPicker from './SubscriptionTagColorPicker/SubscriptionTagColorPicker'

class SubscriptionTags extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showDialog: false,
      tag: undefined
    }

    this.onClickColorCard = this.onClickColorCard.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  onClickColorCard(tag) {
    this.setState({showDialog: true, tag})
  }

  onClose() {
    this.setState({showDialog: false, tag: undefined})
  }

  onSave(color) {
    this.props.onChange({...this.state.tag, color})
  }

  render() {
    return (
      <React.Fragment>
        <ul className='subscription-tags'>
          {this.props.subscriptionTags.map(tag => (
              <li key={tag.uuid} className='subscription-tags__item'>
                <span className='subscription-tags__tag'>{tag.name}</span>
                <span className='subscription-tags__color'
                      style={{backgroundColor: tag.color}}
                      onClick={() => this.onClickColorCard(tag)} />
              </li>
            )
          )}
        </ul>
        {this.state.showDialog &&
          <SubscriptionTagColorPicker tag={this.state.tag}
                                      onSave={this.onSave}
                                      onClose={this.onClose} />}
      </React.Fragment>
    )
  }
}

SubscriptionTags.propTypes = {
  subscriptionTags: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired
}

SubscriptionTags.defaultProps = {
  subscriptionTags: []
}

export default SubscriptionTags
