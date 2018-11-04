import React from 'react'
import PropTypes from 'prop-types'

const style = {
  color: 'rgb(117, 117, 117)'
}

const AutocompleteItemText = ({term, termFragment}) =>
  term.startsWith(termFragment) ?
    <React.Fragment>
      <span style={style}>{termFragment}</span>{term.replace(termFragment, '')}
    </React.Fragment> : term

AutocompleteItemText.propTypes = {
  term: PropTypes.string,
  termFragment: PropTypes.string,
}

AutocompleteItemText.defaultProps = {
  term: '',
  termFragment: '',
}

export default AutocompleteItemText
