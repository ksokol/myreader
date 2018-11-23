import './FeedFetchErrors.css'
import React from 'react'
import PropTypes from 'prop-types'
import {TimeAgo} from '../../../components'
import {Button, IntersectionObserver} from '../../index'

const Failure = props => (
  <div className='my-feed-fetch-errors__item'>
    <span>{props.message}</span>
    <span><TimeAgo date={props.createdAt}/></span>
  </div>
)

Failure.propTypes = {
  message: PropTypes.string,
  createdAt: PropTypes.string.isRequired
}

const FeedFetchErrors = props => {
  const failuresCopy = [...props.failures]
  const lastFailure = failuresCopy.pop()
  const hasNextPage = !!props.links.next
  const onMore = () => props.onMore(props.links.next)

  return (
    <div className='my-feed-fetch-errors'>
      {props.failures.length >= 0 ? [
        failuresCopy.map(item => <Failure key={item.uuid} {...item} />),

        lastFailure && hasNextPage
          ? <IntersectionObserver key={lastFailure.uuid} onIntersection={onMore}>
              <Failure {...lastFailure} />
            </IntersectionObserver>
          : lastFailure && <Failure key={lastFailure.uuid} {...lastFailure} />,

        hasNextPage &&
          <Button key='load-more'
                  className='my-feed-fetch-errors__load-more'
                  disabled={props.loading}
                  onClick={onMore}>
            Load More
          </Button>
      ] : <p>no errors</p>}
    </div>
  )
}

FeedFetchErrors.propTypes= {
  failures: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired
    })
  ),
  links: PropTypes.shape({
    next: PropTypes.any
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onMore: PropTypes.func.isRequired
}

FeedFetchErrors.defaultProps = {
  failures: [],
  links: {}
}

export default FeedFetchErrors
