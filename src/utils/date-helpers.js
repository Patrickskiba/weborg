export const formatDateTime = dt => {
  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    weekday: 'short'
  }).format(dt.date ? new Date(`${dt.date}T00:00:00`) : new Date())
  return [dt.date, dayOfWeek, dt.time].filter(x => !!x).join(' ') || ''
}
