import { saveChanges } from './file-helpers'
import { parseDateTime, setDateToCurrentDay } from './date-helpers'
import addHours from 'date-fns/addHours'
import addDays from 'date-fns/addDays'
import addWeeks from 'date-fns/addWeeks'
import addMonths from 'date-fns/addMonths'
import addYears from 'date-fns/addYears'
import { format } from 'date-fns'

const formatPriority = priority => (priority ? `[#${priority}]` : '')

const getHeadlineText = editNode => editNode.content.map(content => content.text).join(' ')

const sectionFilter = x => x.type === 'section'

const getSectionText = editNode => {
  return editNode.children
    .filter(sectionFilter)
    .map(x =>
      x.content
        .map(x => x.text)
        .filter(x => x)
        .join(' ')
    )
    .join('\n')
}

const formatDate = ({ label, date }) => `${label}: <${date}>`

const createOrgEntry = ({
  level,
  todoState,
  priority,
  headlineText,
  sectionText,
  deadline,
  scheduled
}) => {
  const headlineProps = ['*'.repeat(level), todoState, formatPriority(priority), headlineText]

  const agendaProps = [
    scheduled ? formatDate({ label: 'SCHEDULED', date: scheduled }) : null,
    deadline ? formatDate({ label: 'DEADLINE', date: deadline }) : null
  ]
    .filter(x => !!x)
    .join(' ')

  const headline = headlineProps.filter(prop => !!prop === true).join(' ')

  const entry = []

  if (headline) {
    entry.push(headline)
  }

  if (agendaProps) {
    entry.push(agendaProps)
  }

  if (sectionText) {
    entry.push(...sectionText.split('\n'))
  }

  return entry
}

const rotateTodo = todo => {
  if (todo === undefined) return 'TODO'
  if (todo === 'TODO') return 'DONE'
  if (todo === 'DONE') return undefined
  return undefined
}

const getTaskDateTime = timestamp => {
  const parsedDT = parseDateTime(timestamp)
  if (parsedDT.date && parsedDT.time) {
    return new Date(`${parsedDT.date} ${parsedDT.time}`)
  }

  if (parsedDT.date) return new Date(`${parsedDT.date} 00:00`)
}

const createTaskEntry = ({ type, dateTime, rType, rQuanity, rUnit }) => {
  const date = format(dateTime, 'yyyy-MM-dd iii')
  const time = dateTime
    .toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })
    .replace(' ', ':')

  return `${type} <${[date, time !== '12:00:AM' && time, `${rType}${rQuanity}${rUnit}`]
    .filter(x => x)
    .join(' ')}>`
}

const addTillFuture = ({ addFunc, oldDateTime, rQuanity }) => {
  const currentDateTime = new Date()
  let newDateTime = oldDateTime
  newDateTime = addFunc(newDateTime, rQuanity)
  while (newDateTime < currentDateTime) {
    newDateTime = addFunc(newDateTime, rQuanity)
  }
  return newDateTime
}

const calculateNewDateTime = ({ oldDateTime, rType, rUnit, rQuanity }) => {
  if (rType === '++') {
    if (rUnit === 'h') {
      return addTillFuture({ addFunc: addHours, oldDateTime, rQuanity })
    }
    if (rUnit === 'd') {
      return addTillFuture({ addFunc: addDays, oldDateTime, rQuanity })
    }

    if (rUnit === 'w') {
      return addTillFuture({ addFunc: addWeeks, oldDateTime, rQuanity })
    }

    if (rUnit === 'm') {
      return addTillFuture({ addFunc: addMonths, oldDateTime, rQuanity })
    }

    if (rUnit === 'y') {
      return addTillFuture({ addFunc: addYears, oldDateTime, rQuanity })
    }
  } else if (rType === '.+') {
    const adjustedDateTime = setDateToCurrentDay(oldDateTime)

    if (rUnit === 'h') {
      return addHours(adjustedDateTime, rQuanity)
    }
    if (rUnit === 'd') {
      return addDays(adjustedDateTime, rQuanity)
    }

    if (rUnit === 'w') {
      return addWeeks(adjustedDateTime, rQuanity)
    }

    if (rUnit === 'm') {
      return addMonths(adjustedDateTime, rQuanity)
    }

    if (rUnit === 'y') {
      return addYears(adjustedDateTime, rQuanity)
    }
  } else if (rType === '+') {
    if (rUnit === 'h') {
      return addHours(oldDateTime, rQuanity)
    }
    if (rUnit === 'd') {
      return addDays(oldDateTime, rQuanity)
    }

    if (rUnit === 'w') {
      return addWeeks(oldDateTime, rQuanity)
    }

    if (rUnit === 'm') {
      return addMonths(oldDateTime, rQuanity)
    }

    if (rUnit === 'y') {
      return addYears(oldDateTime, rQuanity)
    }
  }
}

const repeaterAdvance = ({ text, node, selectedRow, dispatch }) => {
  if (node && node.children.length && node.children[0] && node.children[0].type === 'task') {
    const { type, timestamp } = node.children[0].content[0]

    const [, rType, rQuanity, rUnit] = timestamp.match(/(\+\+|\.\+|\+)(\d)(h|d|w|m|y)/)

    const oldDateTime = getTaskDateTime(timestamp)

    const newDateTime = calculateNewDateTime({ oldDateTime, rType, rQuanity, rUnit })

    const newTaskEntry = createTaskEntry({
      type,
      dateTime: newDateTime,
      rType,
      rQuanity,
      rUnit
    })

    const textArr = text.split('\n')

    const newText = [
      ...textArr.slice(0, node.children[0].index),
      newTaskEntry,
      ...textArr.slice(node.children[0].index + 1, textArr.length)
    ].join('\n')

    dispatch({ type: 'setText', payload: newText })
    saveChanges({ selectedRow, newText })
  }
  return
}

const toggleTodoState = ({ text, node, selectedRow, dispatch }) => {
  const toggledHeadline = createOrgEntry({
    level: node.level,
    todoState: rotateTodo(node.State),
    priority: node.priority,
    headlineText: getHeadlineText(node)
  })

  const textArr = text.split('\n')

  const newText = [
    ...textArr.slice(0, node.index),
    toggledHeadline,
    ...textArr.slice(node.index + 1, textArr.length)
  ].join('\n')

  dispatch({ type: 'setText', payload: newText })
  saveChanges({ selectedRow, newText })
}

export { createOrgEntry, toggleTodoState, getSectionText, getHeadlineText, repeaterAdvance }
