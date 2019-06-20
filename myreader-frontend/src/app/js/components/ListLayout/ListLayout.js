import './ListLayout.css'
import React from 'react'
import PropTypes from 'prop-types'
import {SearchInput, IconButton} from '..'
import {withLocationState} from '../../contexts/locationState/withLocationState'

class ListLayout extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    searchParams: PropTypes.shape({
      q: PropTypes.string
    }).isRequired,
    actionPanel: PropTypes.node,
    listPanel: PropTypes.node,
    historyPush: PropTypes.func.isRequired,
    historyReload: PropTypes.func.isRequired
  }

  onChange = q => {
    this.props.historyPush({
      searchParams: {
        ...this.props.searchParams,
        q
      }
    })
  }

  render() {
    const {
      className,
      actionPanel,
      listPanel,
      searchParams,
      historyReload
    } = this.props

    return (
      <div
        className={`my-list-layout ${className}`}
      >
        <div
          className='my-list-layout__action-panel'
        >
          <SearchInput
            className='my-list-layout__search-input'
            onChange={this.onChange}
            value={searchParams.q}
          />
          {actionPanel}
          <IconButton
            type='redo'
            onClick={historyReload}
          />
        </div>
        <div
          className='my-list-layout__list-panel'
        >
          <div
            className='my-list-layout__list-content'
          >
            {listPanel}
          </div>
        </div>
      </div>
    )
  }
}

export default withLocationState(ListLayout)
