export const formatTime = (timeinSeconds: number): string => {
  const minutes = Math.floor(timeinSeconds / 60).toString()
  const seconds = (timeinSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}
