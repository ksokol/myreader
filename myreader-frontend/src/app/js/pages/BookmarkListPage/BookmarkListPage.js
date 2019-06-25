import './BookmarkListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Chips from '../../components/Chips/Chips'
import {EntryList} from '../../components/EntryList/EntryList'
import ListLayout from '../../components/ListLayout/ListLayout'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {changeEntry, fetchEntries, getEntries} from '../../store'
import {BOOKMARK_URL, SUBSCRIPTION_ENTRIES} from '../../constants'
import {withAppContext} from '../../contexts'
import {entryApi} from '../../api'
import {toast} from '../../components/Toast'

const mapStateToProps = state => ({
  ...getEntries(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEntries,
  changeEntry
}, dispatch)

class BookmarkListPage extends React.Component {

  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.any
    ).isRequired,
    links: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    changeEntry: PropTypes.func.isRequired,
    fetchEntries: PropTypes.func.isRequired,
    searchParams: PropTypes.shape({
      entryTagEqual: PropTypes.string
    }).isRequired,
    locationChanged: PropTypes.bool.isRequired,
    locationReload: PropTypes.bool.isRequired,
    pageSize: PropTypes.number.isRequired
  }

  state = {
    entryTags: []
  }

  async componentDidMount() {
    await this.fetchEntryTags()
    this.fetchEntries()
  }

  async componentDidUpdate() {
    if (this.props.locationChanged || this.props.locationReload) {
      this.fetchEntries()
    }
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

  fetchEntries = () => {
    const {
      searchParams: {entryTagEqual, q},
      pageSize: size
    } = this.props
    const seenEqual = entryTagEqual ? '*' : ''
    const query = {seenEqual, entryTagEqual, q, size}

    this.props.fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
  }

  render() {
    const {
      entries,
      links,
      loading,
      changeEntry,
      fetchEntries,
      searchParams
    } = this.props

    const {
      entryTags
    } = this.state

    return (
      <ListLayout
        className='my-bookmark-list'
        listPanel={
          <React.Fragment>
            <Chips
              keyFn={props => props}
              className='my-bookmark-list__tags'
              values={entryTags}
              selected={searchParams.entryTagEqual}
              renderItem={entryTagEqual => (
                <Link
                  to={{pathname: BOOKMARK_URL, search: `?entryTagEqual=${entryTagEqual}`}}>
                  {entryTagEqual}
                </Link>
              )}
            />
            <EntryList
              entries={entries}
              links={links}
              loading={loading}
              onChangeEntry={changeEntry}
              onLoadMore={fetchEntries}
            />
          </React.Fragment>
        }
      />
    )
  }
}

export default withLocationState(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withAppContext(BookmarkListPage))
)
