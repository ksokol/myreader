import './entry-list.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button, IntersectionObserver} from '../'
import {EntryAutoFocus} from './entry'

const entry = (entryProps, props) => (
  <div className="my-entry-list__item" key={entryProps.uuid}>
    <EntryAutoFocus {...{item: {...entryProps}, ...props}} />
  </div>
)

class EntryList extends React.Component {

  constructor(props) {
    super(props)

    this.loadMore = this.loadMore.bind(this)
  }

  get hasNextPage() {
    return !!this.props.links.next
  }

  loadMore() {
    this.props.onLoadMore(this.props.links.next)
  }

  render() {
    const {
      entries,
      showEntryDetails,
      isDesktop,
      focusUuid,
      loading,
      onChangeEntry
    } = this.props

    const props = {
      isDesktop,
      showEntryDetails,
      onChangeEntry,
      focusUuid
    }

    const entriesCopy = [...entries]
    const lastEntry = entriesCopy.pop()

    return (
      <div className='my-entry-list'>
        {entriesCopy.map(entryProps => entry(entryProps, props))}

        {lastEntry && this.hasNextPage
          ? <IntersectionObserver onIntersection={this.loadMore}>
              {entry(lastEntry, props)}
            </IntersectionObserver>
          : lastEntry && entry(lastEntry, props)
        }

        {this.hasNextPage &&
          <Button className='my-button__load-more' disabled={loading} onClick={this.loadMore}>
            Load More
          </Button>
        }
      </div>
    )
  }
}

EntryList.propTypes = {
  links: PropTypes.shape({
    next: PropTypes.any
  }).isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired
    })
  ),
  focusUuid: PropTypes.string,
  showEntryDetails: PropTypes.bool.isRequired,
  isDesktop: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired
}

EntryList.defaultTypes = {
  links: {},
  entries: []
}

export default EntryList
