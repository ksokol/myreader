import './entry.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {EntryTitle} from './entry-title/entry-title'
import {EntryActions} from './entry-actions/entry-actions'
import {EntryContent} from './entry-content/entry-content'
import EntryTags from './entry-tags/entry-tags'

class Entry extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showMore: false,
      showContent: false
    }

    this.onTagUpdate = this.onTagUpdate.bind(this)
    this.toggleMore = this.toggleMore.bind(this)
    this.toggleSeen = this.toggleSeen.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const showContent = props.isDesktop ? props.showEntryDetails || state.showMore : state.showMore
    return {
      showContent
    }
  }

  toggleMore() {
    this.setState({showMore: !this.state.showMore})
  }

  toggleSeen() {
    this.props.onChange({...this.props.item, seen: !this.props.item.seen})
  }

  onTagUpdate(tag) {
    this.props.onChange({
      uuid: this.props.item.uuid,
      seen: this.props.item.seen,
      tag
    })
  }

  render() {
    const {
      title,
      feedTitle,
      origin,
      seen,
      tag: tags,
      content,
      createdAt
    } = this.props.item

    return (
      <div className='my-entry'>
        <div className='my-entry__header'>
          <div className='my-entry__title'>
            <EntryTitle origin={origin}
                        title={title}
                        feedTitle={feedTitle}
                        createdAt={createdAt} />
          </div>
          <div className='my-entry__actions'>
            <EntryActions onToggleShowMore={this.toggleMore}
                          seen={seen}
                          onToggleSeen={this.toggleSeen} />
          </div>
        </div>

        {this.state.showMore && <EntryTags tags={tags} onChange={this.onTagUpdate} />}
        {this.state.showContent && <EntryContent content={content} />}
      </div>
    )
  }
}

Entry.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    feedTitle: PropTypes.string.isRequired,
    tag: PropTypes.string,
    origin: PropTypes.string.isRequired,
    seen: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string
  }).isRequired,
  showEntryDetails: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Entry