import './Entry.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {EntryTitle} from './EntryTitle/EntryTitle'
import {EntryActions} from './EntryActions/EntryActions'
import {EntryContent} from './EntryContent/EntryContent'
import {EntryTags} from './EntryTags/EntryTags'

export class Entry extends Component {

  static propTypes = {
    item: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      feedTitle: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.string
      ).isRequired,
      origin: PropTypes.string.isRequired,
      seen: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      content: PropTypes.string
    }).isRequired,
    className: PropTypes.string,
    role: PropTypes.string,
    onChangeEntry: PropTypes.func.isRequired,
    entryRef: PropTypes.func
  }

  static defaultProps = {
    className: ''
  }

  state = {
    showMore: false
  }

  toggleMore = () => {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  toggleSeen = () => {
    this.props.onChangeEntry({
      ...this.props.item,
      seen: !this.props.item.seen
    })
  }

  onTagUpdate = tags => {
    this.props.onChangeEntry({
      uuid: this.props.item.uuid,
      seen: this.props.item.seen,
      tags
    })
  }

  render() {
    const {
      item,
      className,
      role,
      entryRef,
    } = this.props

    const {
      showMore,
    } = this.state

    return (
      <article
        className={`my-entry ${className}`}
        role={role}
        ref={entryRef}
      >
        <div
          className='my-entry__header'
        >
          <div
            className='my-entry__title'
            title={item.title}
          >
            <EntryTitle
              entry={item}
            />
          </div>
          <div
            className='my-entry__actions'
          >
            <EntryActions
              seen={item.seen}
              showMore={showMore}
              onToggleShowMore={this.toggleMore}
              onToggleSeen={this.toggleSeen}
            />
          </div>
        </div>

        {showMore &&
          <EntryTags
            tags={item.tags}
            onChange={this.onTagUpdate}
          />
        }

        <EntryContent
          maybeVisible={showMore}
          content={item.content}
        />
      </article>
    )
  }
}
