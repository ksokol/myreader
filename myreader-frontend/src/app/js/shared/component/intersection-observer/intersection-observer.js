import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './intersection-observer.css'

class IntersectionObserver extends Component {

  constructor(props) {
    super(props)

    this.myRef = React.createRef()
    this.intersectionHandler = this.intersectionHandler.bind(this)
  }

  componentDidMount() {
    this.observer = new window.IntersectionObserver(this.intersectionHandler)
    this.observer.observe(this.myRef.current)
  }

  componentWillUnmount() {
    this.observer.disconnect()
  }

  intersectionHandler(entries) {
    if (entries[0].isIntersecting) {
      this.props.onIntersection()
    }
  }

  render() {
    return (
      <div className='my-intersection-observer' ref={this.myRef}>
        {this.props.children}
      </div>
    )
  }
}

IntersectionObserver.propTypes = {
  onIntersection: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default IntersectionObserver
