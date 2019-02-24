import {isDefined} from '../../shared/utils'

const styles = `
  <style>
    :host {
        display: block;
    }
    * {
      max-width: 100%;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: #ebece4;
    }
  </style>
`
class HtmlContent extends HTMLElement {

  connectedCallback() {
    const content = this.getAttribute('content')

    if (isDefined(content) && content.length > 0) {
      const template = document.createElement('template')
      template.innerHTML = `${styles}${content}`
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }
}

window.customElements.define('my-html-content', HtmlContent)
