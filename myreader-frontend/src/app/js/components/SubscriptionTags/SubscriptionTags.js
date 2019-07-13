import './SubscriptionTags.css'
import React from 'react'
import {SubscriptionTagColorPicker} from './SubscriptionTagColorPicker/SubscriptionTagColorPicker'
import {subscriptionTagsApi} from '../../api'
import {toast} from '../Toast'

export class SubscriptionTags extends React.Component {

  state = {
    subscriptionTags: [],
    showDialog: false,
    tag: undefined
  }

  componentDidMount = async () => {
    try {
      const {content: subscriptionTags} = await subscriptionTagsApi.fetchSubscriptionTags()
      this.setState({subscriptionTags})
    } catch (error) {
      toast(error, {error: true})
    }
  }

  onClickColorCard = tag => this.setState({showDialog: true, tag})

  onClose = () => this.setState({showDialog: false, tag: undefined})

  onSave = async color => {
    try {
      const subscriptionTag = await subscriptionTagsApi.saveSubscriptionTag({...this.state.tag, color})
      const subscriptionTags = this.state.subscriptionTags
        .map(tag => tag.uuid === subscriptionTag.uuid ? subscriptionTag : tag)
      this.setState({subscriptionTags})
      toast('Tag updated')
    } catch (error) {
      toast(error.data, {error: true})
    }
  }

  render() {
    return (
      <React.Fragment>
        <ul
          className='subscription-tags'
        >
          {this.state.subscriptionTags.map(tag => (
              <li
                key={tag.uuid}
                className='subscription-tags__item'
              >
                <span
                  className='subscription-tags__tag'>{tag.name}
                </span>
                <span
                  className='subscription-tags__color'
                  style={{backgroundColor: tag.color}}
                  onClick={() => this.onClickColorCard(tag)}
                />
              </li>
            )
          )}
        </ul>
        {this.state.showDialog &&
          <SubscriptionTagColorPicker
            tag={this.state.tag}
            onSave={this.onSave}
            onClose={this.onClose}
          />
        }
      </React.Fragment>
    )
  }
}
