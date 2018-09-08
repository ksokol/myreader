import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Chips} from '../../../components'

class EntryTags extends Component {

  constructor(props) {
    super(props)

    this.state = {
      tags: []
    }

    this.onTagAdd = this.onTagAdd.bind(this)
    this.onTagRemove = this.onTagRemove.bind(this)
  }

  static getDerivedStateFromProps(props) {
    return {
      tags: props.tags ? props.tags.split(/[ ,]+/) : []
    }
  }

  onTagAdd(value) {
    if (!this.state.tags.includes(value)) {
      this.props.onChange([...this.state.tags, value].join(', '))
    }
  }

  onTagRemove(key) {
    const tags = this.state.tags.filter(it => it !== key).join(', ')
    this.props.onChange(tags.length > 0 ? tags : null)
  }

  render() {
    return (
      <Chips keyFn={tag => tag}
             values={this.state.tags}
             placeholder='Enter a tag...'
             onAdd={this.onTagAdd}
             onRemove={this.onTagRemove}
             renderItem={tag => tag} />
    )
  }
}

EntryTags.propTypes = {
  tags: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default EntryTags
