import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {changeEntry} from '../../store'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {entryApi} from '../../api'
import {toast} from '../Toast'

const mapDispatchToProps = dispatch => bindActionCreators({
  changeEntry
}, dispatch)

export const withEntriesFromApi = WrappedComponent => {

  const WithEntriesFromApi = class WithEntriesFromApi extends React.Component {

    static propTypes = {
      locationChanged: PropTypes.bool.isRequired,
      locationReload: PropTypes.bool.isRequired,
      changeEntry: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired,
    }

    static defaultProps = {
      query: {}
    }

    state = {
      entries: [],
      links: {},
      loading: false
    }

    async componentDidMount() {
      await this.fetchEntries({query: this.props.query})
    }

    async componentDidUpdate() {
      if (this.props.locationChanged || this.props.locationReload) {
        this.setState({
          entries: [],
          links: {}
        })
        await this.fetchEntries({query: this.props.query})
      }
    }

    fetchEntries = async link => {
      this.setState({
        loading: true
      })

      try {
        const {
          entries,
          links
        } = await entryApi.fetchEntries(link)

        this.setState(state => ({
          entries: state.entries.concat(entries),
          links,
        }))
      } catch (error) {
        toast(error, {error: true})
      } finally {
        this.setState({
          loading: false
        })
      }
    }

    changeEntry = async entry => {
      try {
        const oldEntry = this.state.entries.find(it => it.uuid === entry.uuid)
        const newEntry = await entryApi.updateEntry(entry)

        this.props.changeEntry(newEntry, oldEntry)
        this.setState(state => ({
          entries: state.entries.map(it => it.uuid === newEntry.uuid ? newEntry : it)
        }))
      } catch (error) {
        toast(error, {error: true})
      }
    }

    render() {
      const {
        entries,
        links,
        loading
      } = this.state

      return (
        <WrappedComponent
          entries={entries}
          links={links}
          loading={loading}
          onChangeEntry={this.changeEntry}
          onLoadMore={this.fetchEntries}
        />
      )
    }
  }

  return connect(
    null,
    mapDispatchToProps
  )(withLocationState(WithEntriesFromApi))
}
