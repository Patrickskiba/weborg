import { get, keys } from 'idb-keyval'
import { parseDateTime } from '../utils/date-helpers'
import startOfWeek from 'date-fns/startOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import addHours from 'date-fns/addHours'
import addDays from 'date-fns/addDays'
import addWeeks from 'date-fns/addWeeks'
import addMonths from 'date-fns/addMonths'
import getDayOfYear from 'date-fns/getDayOfYear'
import isToday from 'date-fns/isToday'
import isPast from 'date-fns/isPast'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

const isRepeater = task => task.match(/(\+|\+\+|\.\+)(\d+)(y|w|m|d|h)/)

const parseRepeater = task => {
  const repeater = isRepeater(task)
  return !repeater
    ? undefined
    : { repeaterType: repeater[1], repeaterQuantity: repeater[2], repeaterUnit: repeater[3] }
}

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

const sortAgendas = (curr, next) => {
  if (curr.file.toLowerCase() > next.file.toLowerCase()) return 1
  if (
    curr.file.toLowerCase() === next.file.toLowerCase() &&
    next.taskType === 'SCHEDULED' &&
    curr.taskType === 'DEADLINE'
  )
    return 1
  if (
    curr.file.toLowerCase() === next.file.toLowerCase() &&
    next.taskType === curr.taskType &&
    next.overDueDays < curr.overDueDays
  ) {
    console.log(next.overDueDays)
    console.log(curr.overDueDays)
    return 1
  }

  if (
    curr.file.toLowerCase() === next.file.toLowerCase() &&
    next.taskType === curr.taskType &&
    next.overDueDays > curr.overDueDays
  ) {
    return -1
  }
  return -1
}

const taskRegExp = /((SCHEDULED|DEADLINE):\s*<\d\d\d\d-\d\d-\d\d\s*(\w\w\w\s*)?(\d\d:\d\d:(AM|PM|am|pm)\s*)?((\+|\+\+|\.\+)\d+(y|w|m|d|h))?>)/g
const headlineRegExp = /^(\*+)\s+(?:(todo|done)\s+)?(?:\[#(a|b|c)\]\s+)?(.*?)\s*(:(?:\w+:)+)?$/

const repeatTaskIter = ({
  taskDate,
  repeaterUnit,
  repeaterQuantity,
  rangeStartDate,
  rangeEndDate,
  acc = []
}) => {
  let newDate
  let newAcc = acc

  if (repeaterUnit === 'h') {
    newDate = addHours(taskDate, repeaterQuantity)
  }

  if (repeaterUnit === 'd') {
    newDate = addDays(taskDate, repeaterQuantity)
  }

  if (repeaterUnit === 'w') {
    newDate = addWeeks(taskDate, repeaterQuantity)
  }

  if (repeaterUnit === 'm') {
    newDate = addMonths(taskDate, repeaterQuantity)
  }

  if (newDate >= startOfDay(new Date()) && newDate <= endOfDay(rangeEndDate)) {
    newAcc = [...acc, newDate]
  }

  if (newDate < rangeEndDate) {
    return repeatTaskIter({
      taskDate: newDate,
      repeaterUnit,
      repeaterQuantity,
      rangeStartDate,
      rangeEndDate,
      acc: newAcc
    })
  }

  return newAcc
}

const populateRepeatTasks = (repeaterList, days) =>
  repeaterList.reduce((acc, currTask) => {
    const repeaterUnit = currTask.repeater.repeaterUnit
    const repeaterQuantity = currTask.repeater.repeaterQuantity
    const taskDate = currTask.date
    const rangeStartDate = days[0]
    const rangeEndDate = days[days.length - 1]

    const repeatTasks =
      repeatTaskIter({
        taskDate,
        repeaterUnit,
        repeaterQuantity,
        rangeStartDate,
        rangeEndDate
      }).map(task => ({
        file: currTask.file,
        headline: currTask.headline,
        task: currTask.task,
        taskType: currTask.task.trim()[9] === ':' ? 'SCHEDULED' : 'DEADLINE',
        date: task
      })) || []

    acc = [...acc, ...repeatTasks]

    return acc
  }, [])

const getAgenda = (text, file) => {
  const lines = text.split('\n')

  return lines
    .map((line, idx) => {
      const isTask = line.match(taskRegExp)
      if (!isTask) return

      const taskType = line.trim()[9] === ':' ? 'SCHEDULED' : 'DEADLINE'

      const aboveLine = lines[idx - 1]

      const isBelowHeadline = aboveLine.match(headlineRegExp)
      if (!isBelowHeadline) return

      const dt = parseDateTime(line)

      const date = new Date(`${dt.date}T${dt.time || '00:00'}:00`)

      const repeater = parseRepeater(line)

      const overDueDays = differenceInCalendarDays(date, new Date())

      return {
        file,
        headline: aboveLine,
        taskType,
        task: line,
        dt,
        repeater,
        date,
        overDueDays
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

  const sortedAgenda = await agendas

  return sortedAgenda
}

const getAgendaForRange = async days => {
  const agendaInRange = await agenda()

  const repeatingAgendas = populateRepeatTasks(agendaInRange.filter(task => task.repeater), days)

  const agendaList = [...agendaInRange, ...repeatingAgendas]

  return days.map(day => {
    const tasks = agendaList
      .map(task => {
        if (isToday(day) && task.headline.includes('TODO') && isPast(task.date)) {
          return task
        } else if (getDayOfYear(task.date) === getDayOfYear(day)) {
          return task
        }
      })
      .filter(x => x)
      .sort(sortAgendas)
    return { day, tasks }
  })
}

const getAgendaMonthView = async (date = new Date()) => {
  const month = getDaysOfMonth(date)
  return getAgendaForRange(month)
}

const getAgendaWeekView = async (date = new Date()) => {
  const week = getDaysOfWeek(date)
  console.log(await getAgendaForRange(week))
  return getAgendaForRange(week)
}

const getAgendaDayView = async (date = new Date()) => {
  const selectedDay = [date]
  return getAgendaForRange(selectedDay)
}

export { getAgenda, getAgendaMonthView, getAgendaWeekView, getAgendaDayView }
export default agenda
