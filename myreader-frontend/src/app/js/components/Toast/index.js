import React from 'react'
import {render} from 'react-dom'
import {Toast} from './Toast'

let containerDomNode

function showToasts(notification) {
  if (!containerDomNode) {
    containerDomNode = document.createElement('div')
    containerDomNode.classList.add('my-toast')
    containerDomNode.setAttribute('role', 'dialog')
    document.body.append(containerDomNode)
  }

  render(<Toast notification={notification} />, containerDomNode)
}

function toast(message = 'something went wrong', options) {
  showToasts({
    id: Date.now(),
    text: typeof message === 'string' ? message : JSON.stringify(message),
    type: options && options.error ? 'error' : 'success'
  })
}

export {
  toast
}
