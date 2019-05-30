import {createExchangeHandler} from './exchange-handler'
import {exchange} from '../../../api/exchange'
import {responseHandler} from './responseHandler'
import {createFetchMiddleware} from './fetch-middleware'

const exchangeHandler = createExchangeHandler(params => exchange(params), responseHandler)
const fetchMiddleware = createFetchMiddleware(exchangeHandler)

export default fetchMiddleware
