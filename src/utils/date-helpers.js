export const generateDateString = date => {
  const month = `${date.getMonth()}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export const convert12hrTo24hr = t => {
  const time = t.match(/^\d\d:\d\d:(AM|PM|am|pm)$/)
  if (time) {
    const hr = time[0].substring(0, 2)
    const meridiem = time[0].slice(-2).toLowerCase()

    if (meridiem === 'pm') {
      const formatedHour = `${parseInt(hr) + 12}`
      return `${formatedHour}:${time[0].slice(3, 5)}`
    }

    if (meridiem === 'am') {
      const formatedHour = `${hr}`.padStart(2, '0')
      return `${formatedHour}:${time[0].slice(3, 5)}`
    }
  }
  return t
}

export const convert24hrTo12hr = t => {
  const time = (t || '').match(/^\d\d:\d\d$/)
  if (time) {
    const hr = time[0].substring(0, 2)

    if (hr === '00') {
      return `12:${time[0].slice(3)}:AM`
    }

    if (hr === '12') {
      return `12:${time[0].slice(3)}:PM`
    }

    if (hr > 12) {
      const formatedHour = `${hr - 12}`.padStart(2, '0')
      return `${formatedHour}:${time[0].slice(3)}:PM`
    }

    if (hr <= 12) {
      return `${hr}:${time[0].slice(3)}:AM`
    }
  }
  return t
}

export const formatDateTime = dt => {
  try {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
      weekday: 'short'
    }).format(new Date(`${dt.date}T00:00:00`))
    return [dt.date, dayOfWeek, dt.time].filter(x => !!x).join(' ') || ''
  } catch (error) {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
      weekday: 'short'
    }).format(new Date())
    return [dt.date, dayOfWeek, dt.time].filter(x => !!x).join(' ') || ''
  }
}
