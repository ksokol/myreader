import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {EntryList, IconButton, ListLayout} from '../../components'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {changeEntry, entryClear, fetchEntries, getEntries} from '../../store'
import {SUBSCRIPTION_ENTRIES} from '../../constants'
import {withAppContext} from '../../contexts'
import {withAutofocusEntry} from '../../components/EntryList/withAutofocusEntry'

const mapStateToProps = state => ({
  ...getEntries(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeEntry,
  fetchEntries,
  entryClear
}, dispatch)

const EntryListWithAutofocus = withAutofocusEntry(EntryList)

class Component extends React.Component {

  static propTypes = {
    entries: PropTypes.arrayOf(
      PropTypes.any
    ).isRequired,
    links: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    mediaBreakpoint: PropTypes.string.isRequired,
    searchParams: PropTypes.shape({
      seenEqual: PropTypes.bool
    }).isRequired,
    locationChanged: PropTypes.bool.isRequired,
    locationReload: PropTypes.bool.isRequired,
    entryClear: PropTypes.func.isRequired,
    changeEntry: PropTypes.func.isRequired,
    fetchEntries: PropTypes.func.isRequired,
    showUnseenEntries: PropTypes.bool.isRequired,
    pageSize: PropTypes.number.isRequired,
    onKeyUp: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.fetchEntries()
  }

  componentDidUpdate() {
    if (this.props.locationChanged || this.props.locationReload) {
      this.fetchEntries()
    }
  }

  fetchEntries = () => {
    this.props.entryClear()

    const {
      searchParams,
      showUnseenEntries,
      pageSize: size
    } = this.props
    const seenEqual = searchParams.seenEqual === undefined ? showUnseenEntries === true ? false : '*' : searchParams.seenEqual
    const query = {...searchParams, seenEqual, size}

    this.props.fetchEntries({
      path: SUBSCRIPTION_ENTRIES,
      query
    })
  }

  render() {
    const {
      entries,
      links,
      loading,
      mediaBreakpoint,
      changeEntry,
      fetchEntries,
      onKeyUp
    } = this.props

    const actionPanel = mediaBreakpoint === 'desktop' ?
      <React.Fragment>
        <IconButton
          type='chevron-left'
          onClick={() => onKeyUp({key: 'ArrowLeft'})}
        />
        <IconButton
          type='chevron-right'
          onClick={() => onKeyUp({key: 'ArrowRight'})}
        />
      </React.Fragment> : null

    const listPanel =
      <EntryListWithAutofocus
        entries={entries}
        links={links}
        loading={loading}
        onChangeEntry={changeEntry}
        onLoadMore={fetchEntries}
      />

    return (
      <ListLayout
        actionPanel={actionPanel}
        listPanel={listPanel}
      />
    )
  }
}

export const EntryStreamPage = withLocationState(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withAppContext(Component))
)
