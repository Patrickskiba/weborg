import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../Store'
import { saveChanges } from '../../utils/file-helpers'
import { createOrgEntry } from '../../utils/org-helpers'
import { useFormInput } from '../../utils/custom-hooks'
import { Level, Headline, SelectState, SelectPriority, ContentArea } from './AddEditFields'
import TimestampDialog from '../TimestampDialog'

const clickHandler = ({ text, dispatch, selectedRow, changes }) => {
  const textArr = text.split('\n')

  const newText = [...textArr, ...createOrgEntry(changes)].join('\n')
  dispatch({ type: 'setText', payload: newText })
  saveChanges({ selectedRow, newText })
}

export default ({ shouldSubmit }) => {
  const { text, selectedRow, dispatch } = useContext(StoreContext)
  const level = useState(1)
  const headlineText = useFormInput('')
  const todoState = useState('')
  const priority = useState('')
  const sectionText = useFormInput('')
  const [scheduled, setScheduled] = useState({
    dateTime: '',
    date: '',
    time: ''
  })
  const [deadline, setDeadline] = useState({ dateTime: '', date: '', time: '' })

  useEffect(() => {
    if (shouldSubmit === 'SaveChanges') {
      clickHandler({
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
