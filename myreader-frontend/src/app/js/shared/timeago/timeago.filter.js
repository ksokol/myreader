import timeago from 'timeago.js';

export const TimeagoFilter = () => {
    return (date) => {
        if(date) {
            try {
                return timeago().format(date);
            } catch(e) {}
        }
        return "sometime";
    }
};
