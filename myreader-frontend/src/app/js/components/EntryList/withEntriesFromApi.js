import React from 'react'
import PropTypes from 'prop-types'
import {withLocationState} from '../../contexts/locationState/withLocationState'
import {entryApi} from '../../api'
import {toast} from '../Toast'

export const withEntriesFromApi = WrappedComponent => {

  class WithEntriesFromApi extends React.Component {

    static propTypes = {
      locationStateStamp: PropTypes.number.isRequired,
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

    async componentDidUpdate(prevProps) {
      if (JSON.stringify(this.props.query) !== JSON.stringify(prevProps.query) || this.props.locationStateStamp !== prevProps.locationStateStamp) {
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
        toast(error.data, {error: true})
      } finally {
        this.setState({
          loading: false
        })
      }
    }

    changeEntry = async entry => {
      try {
        const oldValue = this.state.entries.find(it => it.uuid === entry.uuid)
        const newEntry = await entryApi.updateEntry({...entry, context: {oldValue}})

        this.setState(state => ({
          entries: state.entries.map(it => it.uuid === newEntry.uuid ? newEntry : it)
        }))
      } catch (error) {
        toast(error.data, {error: true})
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

  return withLocationState(WithEntriesFromApi)
}
