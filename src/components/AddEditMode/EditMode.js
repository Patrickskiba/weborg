import React, { useEffect, useContext, useState } from 'react'
import { StoreContext } from '../Store'
import { useFormInput } from '../../utils/custom-hooks'
import { saveChanges } from '../../utils/file-helpers'
import { getRange } from '../../utils/node-helpers'
import { deleteNode } from '../DeleteNode'
import { parseDateTime } from '../../utils/date-helpers'
import { createOrgEntry, getHeadlineText, getSectionText } from '../../utils/org-helpers'
import { Level, Headline, SelectState, SelectPriority, ContentArea } from './AddEditFields'
import TimestampDialog from '../TimestampDialog'

const clickHandler = ({ editNode, text, dispatch, selectedRow, changes }) => {
  const editRange = getRange(editNode)
  const textArr = text.split('\n')

  const newText = [
    ...textArr.slice(0, editRange.start),
    ...createOrgEntry(changes),
    ...textArr.slice(editRange.end + 1)
  ].join('\n')

  dispatch({ type: 'setText', payload: newText })
  saveChanges({ selectedRow, newText })
}

const getScheduledTask = node => {
  if (node.children.length && node.children[0].type === 'task') {
    const timestamp = (node.children[0].content.filter(task => task.type === 'SCHEDULED:')[0] || {})
      .timestamp
    if (timestamp) {
      return parseDateTime(timestamp)
    } else return null
  }
}

const getDeadlineTask = node => {
  if (node.children.length && node.children[0].type === 'task') {
    const timestamp = (node.children[0].content.filter(task => task.type === 'DEADLINE:')[0] || {})
      .timestamp
    if (timestamp) {
      return parseDateTime(timestamp)
    } else return null
  }
}

export default ({ shouldSubmit }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)

  if (!mode.payload) return <div />

  const editNode = mode.payload

  const level = useState(editNode.level)
  const headlineText = useFormInput(getHeadlineText(editNode))
  const todoState = useState(editNode.State ? editNode.State : '')
  const priority = useState(editNode.priority ? editNode.priority : '')
  const sectionText = useFormInput(getSectionText(editNode))
  const [scheduled, setScheduled] = useState(getScheduledTask(editNode) || '')
  const [deadline, setDeadline] = useState(getDeadlineTask(editNode) || '')

  useEffect(() => {
    if (shouldSubmit === 'SaveChanges') {
      clickHandler({
        editNode,
        text,
        dispatch,
        selectedRow,
        changes: {
          level: level[0],
          headlineText: headlineText.value,
          todoState: todoState[0],
          priority: priority[0],
          sectionText: sectionText.value,
          deadline: deadline.dateTime,
          scheduled: scheduled.dateTime
        }
      })
      dispatch({ type: 'setMode', payload: { type: 'View', payload: null } })
    }

    if (shouldSubmit === 'Delete') {
      deleteNode({ editNode, text, dispatch, selectedRow })
      dispatch({ type: 'setMode', payload: { type: 'View', payload: null } })
    }

    if (shouldSubmit === 'CancelChanges') {
      dispatch({ type: 'setMode', payload: { type: 'View', payload: null } })
    }
  }, [shouldSubmit])

  return (
    <div className='big-chungus'>
      <Level level={level} />
      <Headline headline={headlineText} />
      <SelectState state={todoState} />
      <SelectPriority priority={priority} />
      <TimestampDialog dateTime={scheduled} setDateTime={setScheduled} label='SCHEDULED' />
      <TimestampDialog dateTime={deadline} setDateTime={setDeadline} label='DEADLINE' />
      <ContentArea section={sectionText} />
    </div>
  )
}
