import './Entry.css'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {EntryTitle} from './EntryTitle/EntryTitle'
import {EntryActions} from './EntryActions/EntryActions'
import {EntryContent} from './EntryContent/EntryContent'
import EntryTags from './EntryTags/EntryTags'

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
    return {
      showContent: props.isDesktop ? props.showEntryDetails || state.showMore : state.showMore
    }
  }

  toggleMore() {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  toggleSeen() {
    this.props.onChangeEntry({
      ...this.props.item,
      seen: !this.props.item.seen
    })
  }

  onTagUpdate(tag) {
    this.props.onChangeEntry({
      uuid: this.props.item.uuid,
      seen: this.props.item.seen,
      tag
    })
  }

  get entryTitle() {
    if (!this._entryTitle) {
      const {
        item
      } = this.props

      this._entryTitle = <EntryTitle entry={item} />
    }

    return this._entryTitle
  }

  render() {
    const {
      item: {
        seen,
        tag: tags,
        content
      },
      className,
      entryRef
    } = this.props

    const {
      showMore,
      showContent
    } = this.state

    const classes = classNames('my-entry', className)

    return (
      <div className={classes} ref={entryRef}>
        <div className='my-entry__header'>
          <div className='my-entry__title'>
            {this.entryTitle}
          </div>
          <div className='my-entry__actions'>
            <EntryActions seen={seen}
                          showMore={showMore}
                          onToggleShowMore={this.toggleMore}
                          onToggleSeen={this.toggleSeen} />
          </div>
        </div>

        {showMore &&
          <EntryTags tags={tags} onChange={this.onTagUpdate} />
        }

        {showContent &&
          <EntryContent content={content} />
        }
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
  className: PropTypes.string,
  onChangeEntry: PropTypes.func.isRequired,
  entryRef: PropTypes.func
}

export default Entry
