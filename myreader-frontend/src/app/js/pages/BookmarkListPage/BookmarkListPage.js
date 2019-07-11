import './BookmarkListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Chips} from '../../components/Chips/Chips'
import {EntryList  as EntryListComponent} from '../../components/EntryList/EntryList'
import ListLayout from '../../components/ListLayout/ListLayout'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {BOOKMARK_URL} from '../../constants'
import {withAppContext} from '../../contexts'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'
import {withEntriesFromApi} from '../../components/EntryList/withEntriesFromApi'

const EntryList = withEntriesFromApi(EntryListComponent)

class BookmarkListPage extends React.Component {

  static propTypes = {
    searchParams: PropTypes.shape({
      entryTagEqual: PropTypes.string
    }).isRequired,
    locationReload: PropTypes.bool.isRequired,
    pageSize: PropTypes.number.isRequired
  }

  state = {
    entryTags: []
  }

  async componentDidMount() {
    await this.fetchEntryTags()
  }

  async componentDidUpdate() {
    if (this.props.locationReload) {
      await this.fetchEntryTags()
    }
  }

  fetchEntryTags = async () => {
    try {
      this.setState({
        entryTags: await entryApi.fetchEntryTags()
      })
    } catch (error) {
      toast(error, {error: true})
    }
  }

  render() {
    const {
      searchParams: {entryTagEqual, q},
      pageSize: size
    } = this.props

    const {
      entryTags
    } = this.state

    const seenEqual = entryTagEqual ? '*' : ''
    const query = {seenEqual, entryTagEqual, q, size}

    return (
      <ListLayout
        className='my-bookmark-list'
        listPanel={
          <React.Fragment>
            <Chips
              keyFn={props => props}
              className='my-bookmark-list__tags'
              values={entryTags}
              selected={entryTagEqual}
              renderItem={entryTagEqual => (
                <Link
                  to={{pathname: BOOKMARK_URL, search: `?entryTagEqual=${entryTagEqual}`}}>
                  {entryTagEqual}
                </Link>
              )}
            />
            <EntryList
              query={query}
            />
          </React.Fragment>
        }
      />
    )
  }
}

export default withLocationState(withAppContext(BookmarkListPage))
