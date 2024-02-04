import {createRoot} from 'react-dom/client'
import {Toast} from './Toast'

let root
let counter = 0

function showToasts(notification) {
  if (!root) {
    const containerDomNode = document.createElement('div')
    containerDomNode.classList.add('my-toast')
    containerDomNode.setAttribute('role', 'dialog')
    document.body.append(containerDomNode)
    root = createRoot(containerDomNode)
  }

  root.render(<Toast notification={notification} />)
}

export function toast(message = 'something went wrong', options) {
  showToasts({
    id: `${Date.now()} ${++counter}`,
    text: typeof message === 'string' ? message : JSON.stringify(message),
    type: options && options.error ? 'error' : 'success'
  })
}
