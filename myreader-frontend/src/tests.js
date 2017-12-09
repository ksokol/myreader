import 'angular'
import 'angular-mocks'
import 'angular-material/angular-material-mocks'

const context = require.context('./app/js', true, /\.js$/)
context.keys().forEach(context)

// TODO deprecated
const testContext = require.context('../test', true, /\.js$/)
testContext.keys().forEach(testContext)

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())
