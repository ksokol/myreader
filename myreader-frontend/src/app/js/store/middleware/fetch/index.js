import {createExchangeHandler} from './exchange-handler'
import {api} from '../../../api'
import {responseHandler} from './responseHandler'
import {createFetchMiddleware} from './fetch-middleware'

const exchangeHandler = createExchangeHandler(params => api.request(params), responseHandler)
const fetchMiddleware = createFetchMiddleware(exchangeHandler)

export default fetchMiddleware
