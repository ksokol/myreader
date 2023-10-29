import './ListLayout.css'
import ReactDOM from 'react-dom'

function ActionPanelPortal({children}) {
  const portal = document.querySelector('#portal-header')

  return portal ? ReactDOM.createPortal(
    children,
    portal
  ) : null
}

export function ListLayout({
  className,
  actionPanel,
  listPanel,
}) {
  return (
    <div
      className={`my-list-layout ${className ? className : ''}`}
    >
      <ActionPanelPortal>{actionPanel}</ActionPanelPortal>
      <div
        className='my-list-layout__list-panel'
      >
        <div
          className='my-list-layout__list-content'
        >
          {listPanel}
        </div>
      </div>
    </div>
  )
}
