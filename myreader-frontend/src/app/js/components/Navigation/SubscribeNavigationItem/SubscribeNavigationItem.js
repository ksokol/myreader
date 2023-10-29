import './SubscribeNavigationItem.css'
import {useEffect, useState} from 'react'
import {NavigationItem} from '../NavigationItem'
import {Dialog} from '../../Dialog/Dialog'
import {SUBSCRIPTION_PAGE_PATH} from '../../../constants'
import {toast} from '../../Toast'
import {Button} from '../../Buttons'
import {Input} from '../../Input/Input'
import {useSubscribe} from './subscribe'
import {useRouter} from '../../../contexts/router'
import {useNavigation} from '../../../hooks/navigation'

function SubscribeDialog({onClose}) {
  const {replaceRoute} = useRouter()
  const {pending, error, uuid, validations, subscribe} = useSubscribe()
  const {fetchData} = useNavigation()
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (error) {
      toast(error, {error: true})
    }
  }, [error])

  useEffect(() => {
    if (uuid) {
      toast('Subscribed')
      fetchData()
      replaceRoute({
        pathname: SUBSCRIPTION_PAGE_PATH,
        search: `uuid=${uuid}`
      })
      onClose()
    }
  }, [replaceRoute, onClose, uuid, fetchData])

  const body = (
    <form
      className='my-subscribe-navigation-item__form'
    >
      <Input
        name='origin'
        value={origin}
        label='Url'
        disabled={pending}
        validations={validations}
        onChange={event => setOrigin(event.target.value)}
      />
    </form>
  )

  const footer = (
    <Button
      disabled={pending}
      onClick={() => subscribe(origin)}
      primary>Subscribe
    </Button>
  )

  return (
    <Dialog
      body={body}
      footer={footer}
      onClickClose={onClose}
    >
    </Dialog>
  )
}

export function SubscribeNavigationItem({onClick}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const onCloseDialog = () => {
    setDialogOpen(false)
    onClick()
  }

  return (
    <>
      {dialogOpen && <SubscribeDialog onClose={onCloseDialog}/>}
      <NavigationItem
        title='Add subscription'
        className='my-navigation__item--blue'
        to={{}}
        onClick={event => {
          event.preventDefault()
          setDialogOpen(true)
        }}
      />
    </>
  )
}
