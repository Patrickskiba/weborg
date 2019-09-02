export const formatDateTime = dt => {
  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    weekday: 'short'
  }).format(new Date(`${dt.date}T00:00:00`))
  return [dt.date, dayOfWeek, dt.time].filter(x => !!x).join(' ') || ''
}
