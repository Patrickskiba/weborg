import { get, keys } from 'idb-keyval'
import { parseDateTime } from '../utils/date-helpers'
import startOfWeek from 'date-fns/startOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import addDays from 'date-fns/addDays'
import getDayOfYear from 'date-fns/getDayOfYear'
import isToday from 'date-fns/isToday'
import isPast from 'date-fns/isPast'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

export const getDaysOfWeek = (date = new Date()) => {
  const weekStart = startOfWeek(date)

  return [...Array(7)].map((_, idx) => {
    return addDays(weekStart, idx)
  })
}

export const getDaysOfMonth = (date = new Date()) => {
  const monthStart = startOfMonth(date)

  return [...Array(getDaysInMonth(date))].map((_, idx) => {
    return addDays(monthStart, idx)
  })
}

const taskRegExp = /((SCHEDULED|DEADLINE):\s*<\d\d\d\d-\d\d-\d\d\s*(\w\w\w\s*)?(\d\d:\d\d:(AM|PM|am|pm)\s*)?((\+|\+\+|\.\+)\d+(y|w|m|d|h))?>)/g
const headlineRegExp = /^(\*+)\s+(?:(TODO|DONE)\s+)?(?:\[#(A|B|C)\]\s+)?(.*?)\s*(:(?:\w+:)+)?$/

const getAgenda = (text, file) => {
  const lines = text.split('\n')

  return lines
    .map((line, idx) => {
      const isTask = line.match(taskRegExp)
      if (!isTask) return

      const aboveLine = lines[idx - 1]

      const isBelowHeadline = aboveLine.match(headlineRegExp)
      if (!isBelowHeadline) return

      const dt = parseDateTime(text)

      const date = new Date(`${dt.date}T${dt.time || '00:00'}`)

      return {
        file,
        headline: aboveLine,
        task: line,
        dt,
        date
      }
    })
    .filter(item => item)
}

const agenda = async () => {
  const fileList = await keys()

  const agendas = fileList.reduce(async (acc, file) => {
    const text = await get(file)
    const agendaList = getAgenda(text, file)

    if (!agendaList.length) return acc
    return [...(await acc), ...agendaList]
  }, [])

  const sortedAgenda = (await agendas).sort((curr, next) => next - curr)

  return sortedAgenda
}

const getAgendaForRange = async days => {
  const agendaList = await agenda()

  return days.map(day => {
    const tasks = []
    agendaList.forEach(task => {
      if (isToday(day) && task.headline.includes('TODO') && isPast(task.date)) {
        const overDueDays = differenceInCalendarDays(task.date, day)
        tasks.push({ ...task, overDueDays })
        return { day, tasks }
      }
      if (getDayOfYear(task.date) === getDayOfYear(day)) {
        tasks.push(task)
      }
    })
    return { day, tasks }
  })
}

const getAgendaMonthView = async (date = new Date()) => {
  const month = getDaysOfMonth(date)
  return getAgendaForRange(month)
}

const getAgendaWeekView = async (date = new Date()) => {
  const week = getDaysOfWeek(date)
  return getAgendaForRange(week)
}

const getAgendaDayView = async (date = new Date()) => {
  const selectedDay = [date]
  return getAgendaForRange(selectedDay)
}

export { getAgenda, getAgendaMonthView, getAgendaWeekView, getAgendaDayView }
export default agenda
