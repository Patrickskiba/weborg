import { saveChanges } from './file-helpers'

const formatPriority = priority => (priority ? `[#${priority}]` : '')

const getHeadlineText = editNode =>
  editNode.content.map(content => content.text).join(' ')

const sectionFilter = x => x.type === 'section'

const getSectionText = editNode => {
  return editNode.children
    .filter(sectionFilter)
    .map(x => x.content.map(x => x.text))
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
  const headlineProps = [
    '*'.repeat(level),
    todoState,
    formatPriority(priority),
    headlineText
  ]

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

export { createOrgEntry, toggleTodoState, getSectionText, getHeadlineText }
