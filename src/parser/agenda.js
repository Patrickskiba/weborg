import { get, keys } from 'idb-keyval'
import { parseDateTime } from '../utils/date-helpers'
import startOfWeek from 'date-fns/startOfWeek'
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

const getAgendaWeekView = async (date = new Date()) => {
  const week = getDaysOfWeek(date)
  const agendaList = await agenda()

  return week.map(day => {
    const tasks = []
    agendaList.forEach(task => {
      if (isToday(day) && task.headline.includes('TODO') && isPast(task.date)) {
        const overDays = differenceInCalendarDays(task.date, day)
        tasks.push({ ...task, overDays })
        return { day, tasks }
      }
      if (getDayOfYear(task.date) === getDayOfYear(day)) {
        tasks.push(task)
      }
    })
    return { day, tasks }
  })
}

export { getAgenda, getAgendaWeekView }
export default agenda
