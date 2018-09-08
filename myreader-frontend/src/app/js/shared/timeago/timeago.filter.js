import timeago from 'timeago.js'

/**
 * @deprecated
 */
export const TimeagoFilter = () => {
    return date => {
        if(date) {
            try {
                return timeago().format(date)
            } catch(e) {
                return 'sometime'
            }
        }
        return 'sometime'
    }
}
