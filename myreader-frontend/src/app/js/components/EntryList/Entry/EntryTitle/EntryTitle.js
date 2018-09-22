import './EntryTitle.css'
import React from 'react'
import PropTypes from 'prop-types'
import {TimeAgo} from '../../..'

export const EntryTitle = props => [
  <a key="title"
     className="my-entry-title__title"
     href={props.origin}
     target="_blank"
     rel="noopener noreferrer">{props.title}
  </a>,
  <span key="subtitle" className="my-entry-title__subtitle">
    <TimeAgo date={props.createdAt}/> on {props.feedTitle}
  </span>
]

EntryTitle.propTypes = {
  origin: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  feedTitle: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired
}
