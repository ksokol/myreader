import {createFetchMiddleware} from './fetch-middleware'
import {exchange} from './exchange'

const fetchMiddleware = createFetchMiddleware(params => exchange(params))

export default fetchMiddleware
