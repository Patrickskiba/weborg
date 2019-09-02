import React, { useEffect, useContext, useState } from 'react'
import { StoreContext } from './Store'
import { useFormInput } from '../utils/custom-hooks'
import { saveChanges } from '../utils/file-helpers'
import { makeStyles } from '@material-ui/core/styles'
import { getRange } from '../utils/node-helpers'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import { deleteNode } from './DeleteNode'
import { formatDateTime } from '../utils/date-helpers'
import {
  createOrgEntry,
  getHeadlineText,
  getSectionText
} from '../utils/org-helpers'
import TimestampDialog from './TimestampDialog'

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

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  label: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  selectArea: {
    marginTop: '1rem',
    marginBottom: '1rem'
  }
}))

const convert12hrTo24hr = t => {
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

const parseTimestamp = timestamp => {
  const date = timestamp.match(/\d\d\d\d-\d\d-\d\d/)
  const time = timestamp.match(/\d\d:\d\d:(AM|PM|am|pm)?/)

  if (date && time) {
    return {
      dateTime: formatDateTime({ date: date[0], time: time[0] }),
      time: convert12hrTo24hr(time[0]),
      date: date[0]
    }
  }

  if (date) {
    return {
      dateTime: formatDateTime({ date: date[0] }),
      date: date[0]
    }
  }

  return null
}

const getScheduledTask = node => {
  if (node.children.length && node.children[0].type === 'task') {
    const timestamp = (
      node.children[0].content.filter(task => task.type === 'SCHEDULED:')[0] ||
      {}
    ).timestamp
    if (timestamp) {
      return parseTimestamp(timestamp)
    } else return null
  }
}

const getDeadlineTask = node => {
  if (node.children.length && node.children[0].type === 'task') {
    const timestamp = (
      node.children[0].content.filter(task => task.type === 'DEADLINE:')[0] ||
      {}
    ).timestamp
    if (timestamp) {
      return parseTimestamp(timestamp)
    } else return null
  }
}

const inputStyle = { width: '90%', marginRight: '5px', marginLeft: '5px' }

export default ({ shouldSubmit }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)

  if (!mode.payload) return <div />

  const editNode = mode.payload

  const classes = useStyles()

  const level = useFormInput(editNode.level)
  const headlineText = useFormInput(getHeadlineText(editNode))
  const todoState = useFormInput(editNode.State ? editNode.State : '')
  const priority = useFormInput(editNode.priority ? editNode.priority : '')
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

    if (shouldSubmit === 'Delete') {
      deleteNode({ editNode, text, dispatch, selectedRow })
      dispatch({ type: 'setMode', payload: { type: 'View', payload: null } })
    }

    if (shouldSubmit === 'CancelChanges') {
      dispatch({ type: 'setMode', payload: { type: 'View', payload: null } })
    }
  }, [shouldSubmit])

  return (
    <div>
      <div>
        <TextField
          id='headline-level-edit'
          label='Level'
          type='number'
          className={classes.textField}
          style={inputStyle}
          margin='normal'
          {...level}
        />
      </div>
      <div>
        <TextField
          id='headline-text-edit'
          label='Headline'
          className={classes.textField}
          style={inputStyle}
          margin='normal'
          {...headlineText}
        />
      </div>
      <div className={classes.selectArea}>
        <InputLabel
          className={classes.label}
          shrink
          htmlFor='state-label-placeholder'
        >
          State
        </InputLabel>
        <Select
          id='todo-state-edit'
          style={inputStyle}
          displayEmpty
          input={<Input name='State' id='state-label-placeholder' />}
          name='State'
          {...todoState}
        >
          <MenuItem value=''>
            <em>none</em>
          </MenuItem>
          <MenuItem value='TODO'>TODO</MenuItem>
          <MenuItem value='DONE'>DONE</MenuItem>
        </Select>
      </div>
      <div className={classes.selectArea}>
        <InputLabel
          className={classes.label}
          shrink
          htmlFor='priority-label-placeholder'
        >
          Priority
        </InputLabel>
        <Select
          id='priority-edit'
          style={inputStyle}
          displayEmpty
          input={<Input name='Priority' id='priority-label-placeholder' />}
          name='Priority'
          {...priority}
        >
          <MenuItem value=''>
            <em>none</em>
          </MenuItem>
          <MenuItem value='A'>A</MenuItem>
          <MenuItem value='B'>B</MenuItem>
          <MenuItem value='C'>C</MenuItem>
        </Select>
      </div>
      <div>
        <TextField
          id='section-text-edit'
          label='Content'
          multiline
          className={classes.textField}
          style={inputStyle}
          margin='normal'
          {...sectionText}
        />
      </div>
      <div>
        <div>
          <TimestampDialog
            dateTime={scheduled}
            setDateTime={setScheduled}
            label='SCHEDULED'
          />
        </div>
        <div>
          <TimestampDialog
            dateTime={deadline}
            setDateTime={setDeadline}
            label='DEADLINE'
          />
        </div>
      </div>
    </div>
  )
}
