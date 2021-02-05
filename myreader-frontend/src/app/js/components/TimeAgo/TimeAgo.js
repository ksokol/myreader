import {useMemo} from 'react'
import {formatTimeAgo} from './formatTimeAgo'

export function TimeAgo({date}) {
  return useMemo(() => formatTimeAgo(date), [date])
}
