import ReactDOM from 'react-dom'
import {register} from 'register-service-worker'
import {App} from './App'

ReactDOM.render(
  <App />,
  document.querySelector('#root')
)

register('./service-worker.js')
