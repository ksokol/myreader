import './EntryList.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Button} from '../Buttons'
import IntersectionObserver from '../IntersectionObserver/IntersectionObserver'
import {EntryAutoFocus} from './Entry/EntryAutoFocus'

const entry = (entryProps, props) => (
  <div className="my-entry-list__item" key={entryProps.uuid}>
    <EntryAutoFocus {...{item: {...entryProps}, ...props}} />
  </div>
)

export class EntryList extends React.Component {

  static propTypes = {
    links: PropTypes.shape({
      next: PropTypes.any
    }).isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired
      })
    ),
    entryInFocus: PropTypes.shape({
      uuid: PropTypes.string
    }),
    loading: PropTypes.bool.isRequired,
    onChangeEntry: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired
  }

  static defaultProps = {
    links: {},
    entries: []
  }

  get hasNextPage() {
    return !!this.props.links.next
  }

  loadMore = () => this.props.onLoadMore(this.props.links.next)

  render() {
    const {
      entries,
      entryInFocus,
      loading,
      onChangeEntry
    } = this.props

    const props = {
      onChangeEntry,
      focusUuid: entryInFocus && entryInFocus.uuid
    }

    const entriesCopy = [...entries]
    const lastEntry = entriesCopy.pop()

    return (
      <div
        className='my-entry-list'
      >
        {entriesCopy.map(entryProps => entry(entryProps, props))}

        {lastEntry && this.hasNextPage
          ? <IntersectionObserver
            onIntersection={this.loadMore}
          >{entry(lastEntry, props)}
            </IntersectionObserver>
          : lastEntry && entry(lastEntry, props)
        }

        {this.hasNextPage &&
          <Button
            className='my-button__load-more'
            disabled={loading}
            onClick={this.loadMore}
          >Load More
          </Button>
        }
      </div>
    )
  }
}
