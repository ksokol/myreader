import './SubscribeNavigationItem.css'
import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {generatePath, useHistory} from 'react-router'
import {NavigationItem} from '../NavigationItem'
import {Dialog} from '../../Dialog/Dialog'
import {SUBSCRIPTION_PAGE_PATH} from '../../../constants'
import {toast} from '../../Toast'
import {Button} from '../../Buttons'
import {Input} from '../../Input/Input'
import {useSubscribe} from './subscribe'

function SubscribeDialog({onClose}) {
  const [origin, setOrigin] = useState('')
  const history = useHistory()
  const {pending, error, uuid, validations, subscribe} = useSubscribe()

  useEffect(() => {
    if (error) {
      toast(error, {error: true})
    }
  }, [error])

  useEffect(() => {
    if (uuid) {
      toast('Subscribed')
      history.replace({
        pathname: generatePath(SUBSCRIPTION_PAGE_PATH, {uuid})
      })
      onClose()

    }
  }, [history, onClose, uuid])

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

SubscribeDialog.propTypes = {
  onClose: PropTypes.func.isRequired
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

SubscribeNavigationItem.propTypes = {
  onClick: PropTypes.func.isRequired
}
