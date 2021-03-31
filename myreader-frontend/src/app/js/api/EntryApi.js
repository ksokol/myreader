import {SUBSCRIPTION_ENTRIES} from '../constants'
import {Api} from './Api'

export class EntryApi extends Api {

  updateEntry = ({uuid, seen, tags, context}) => {
    return this.request({
      method: 'PATCH',
      url: `${SUBSCRIPTION_ENTRIES}/${uuid}`,
      body: {seen, tags},
      context
    })
  }
}
