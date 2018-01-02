import {createExchangeHandler} from './exchange-handler'
import {exchange} from './exchange'
import {responseHandler} from './response-handler'
import {createFetchMiddleware} from './fetch-middleware'

const exchangeHandler = createExchangeHandler(params => exchange(params), responseHandler)
const fetchMiddleware = createFetchMiddleware(exchangeHandler)

export default fetchMiddleware
