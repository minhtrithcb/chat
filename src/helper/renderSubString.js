import moment from 'moment'
import 'moment/locale/vi'

export default function renderSubString(text, limit) {
    return text.length > limit ? `${text.substring(0, limit)} ...`: text
} 

export function renderTimeDiff(message) {
    return moment(message).fromNow()
} 

