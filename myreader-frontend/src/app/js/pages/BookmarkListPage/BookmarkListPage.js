import './BookmarkListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Chips, EntryList, ListLayout} from '../../components'
import {withLocationState} from '../../contexts'
import {
  changeEntry,
  fetchEntries,
  fetchEntryTags,
  getEntries,
  getEntryTags,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {BOOKMARK_URL, SUBSCRIPTION_ENTRIES} from '../../constants'

const mapStateToProps = state => ({
  ...getEntries(state),
  showEntryDetails: settingsShowEntryDetailsSelector(state),
  isDesktop: mediaBreakpointIsDesktopSelector(state),
  ...getEntryTags(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEntries,
  changeEntry,
  fetchEntryTags
}, dispatch)

class BookmarkListPage extends React.Component {

  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.any
    ).isRequired,
    entryTags: PropTypes.any.isRequired,
    links: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    showEntryDetails: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    changeEntry: PropTypes.func.isRequired,
    fetchEntries: PropTypes.func.isRequired,
    fetchEntryTags: PropTypes.func.isRequired,
    searchParams: PropTypes.shape({
      entryTagEqual: PropTypes.string
    }).isRequired,
    locationChanged: PropTypes.bool.isRequired,
    locationReload: PropTypes.bool.isRequired
  }

  componentDidMount() {
    this.props.fetchEntryTags()
    this.fetchEntries()
  }

  componentDidUpdate() {
    if (this.props.locationChanged || this.props.locationReload) {
      this.fetchEntries()
    }
  }

  fetchEntries = () => {
    const query = {seenEqual: '*', ...this.props.searchParams}
    this.props.fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
  }

  render() {
    const {
      entryTags,
      entries,
      links,
      loading,
      showEntryDetails,
      isDesktop,
      changeEntry,
      fetchEntries,
      searchParams
    } = this.props

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
              isDesktop={isDesktop}
              showEntryDetails={showEntryDetails}
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
  )(BookmarkListPage)
)
