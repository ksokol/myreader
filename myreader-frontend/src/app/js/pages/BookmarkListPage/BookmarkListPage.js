import './BookmarkListPage.css'
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Chips, EntryList, ListLayout} from '../../components'
import {toQueryObject, withQuery} from '../../shared/location-utils'
import {
  changeEntry,
  fetchEntries,
  fetchEntryTags,
  getEntries,
  getEntryTags,
  mediaBreakpointIsDesktopSelector,
  settingsShowEntryDetailsSelector
} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'

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
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        entryTagEqual: PropTypes.string
      }).isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.props.fetchEntryTags()

    const {entryTagEqual} = this.props.match.params
    const query = {seenEqual: '*', entryTagEqual, ...toQueryObject(this.props.location)}
    this.props.fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {q: prevQ} = toQueryObject(prevProps.location)
    const {q: currentQ} = toQueryObject(this.props.location)

    if (prevQ !== currentQ) {
      const {entryTagEqual} = this.props.match.params
      const query = {seenEqual: '*', entryTagEqual, ...toQueryObject(this.props.location)}
      this.props.fetchEntries({path: SUBSCRIPTION_ENTRIES, query})
    }
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
      location,
      history
    } = this.props
    const query = toQueryObject(location)

    return (
      <ListLayout
        className='my-bookmark-list'
        listPanel={
          <React.Fragment>
            <Chips
              keyFn={props => props}
              className='my-bookmark-list__tags'
              values={entryTags}
              selected={query.entryTagEqual}
              onSelect={entryTagEqual => history.push(withQuery(location, {...query, entryTagEqual}))}
              renderItem={props => props}
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BookmarkListPage)
)
