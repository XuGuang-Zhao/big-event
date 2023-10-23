import { dayjs } from 'element-plus'

export const formatTime = (time) => dayjs(time).format('YYYY-DD-MM')
