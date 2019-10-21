import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from '../Store'
import { saveChanges } from '../../utils/file-helpers'
import { createOrgEntry } from '../../utils/org-helpers'
import { useFormInput } from '../../utils/custom-hooks'
import TimestampDialog from '../TimestampDialog'
import TextField, { Input } from '@material/react-text-field'

const clickHandler = ({ text, dispatch, selectedRow, changes }) => {
  const textArr = text.split('\n')

  const newText = [...textArr, ...createOrgEntry(changes)].join('\n')
  dispatch({ type: 'setText', payload: newText })
  saveChanges({ selectedRow, newText })
}

const Level = ({ level }) => {
  return (
    <div>
      <div className='sub-header-1'>Select a level</div>
      <div className='row counter-row'>
        <div className='counter-button minus-button'>
          <i className='material-icons large-icon'>remove</i>
        </div>
        <div className='headline-4'>{level}</div>
        <div className='counter-button add-button'>
          <i className='material-icons large-icon'>add</i>
        </div>
      </div>
    </div>
  )
}

const Headline = headline => {
  return (
    <TextField outlined className='full-length-input' label='Headline'>
      <Input {...headline} />
    </TextField>
  )
}

const SelectState = ({ state }) => {
  return (
    <div>
      <div className='sub-header-1'>Select a state</div>
      <div className='row state-row'>
        {['None', 'Todo', 'Done'].map(x => (
          <div key={x} className={`chip ${x === state.value ? 'chip-selected' : ''}`}>
            <span className='chip-text'>{x}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SelectPriority = ({ priority }) => {
  return (
    <div>
      <div className='sub-header-1'>Select a priority</div>
      <div className='row priority-row'>
        {['None', 'A', 'B', 'C'].map(x => (
          <div key={x} className={`chip ${x === priority.value ? 'chip-selected' : ''}`}>
            <span className='chip-text'>{x}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ({ shouldSubmit }) => {
  const { text, selectedRow, dispatch } = useContext(StoreContext)
  const level = useFormInput('1')
  const headlineText = useFormInput('')
  const todoState = useFormInput('None')
  const priority = useFormInput('None')
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
          level: level.value,
          headlineText: headlineText.value,
          todoState: todoState.value,
          priority: priority.value,
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
    <div>
      <Level level={level.value} />
      <Headline headline={headlineText} />
      <SelectState state={todoState} />
      <SelectPriority priority={priority} />
      <div>
        <TimestampDialog dateTime={scheduled} setDateTime={setScheduled} label='SCHEDULED' />
      </div>
      <div>
        <TimestampDialog dateTime={deadline} setDateTime={setDeadline} label='DEADLINE' />
      </div>
    </div>
  )
}
