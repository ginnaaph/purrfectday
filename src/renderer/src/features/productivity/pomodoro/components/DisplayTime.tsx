import { formatTime } from '@/utils/dates-time/getFornattedTime'
import type { DisplayTimeProps } from '../types'

const DisplayTime = ({ seconds }: DisplayTimeProps) => {
  return <div className="text-5xl font-bold text-primary py-1">{formatTime(seconds)}</div>
}

export default DisplayTime
