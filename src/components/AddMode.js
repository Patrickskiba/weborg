import React, {useEffect, useState, useContext} from 'react'
import {StoreContext} from './Store'
import {saveChanges} from '../utils/file-helpers'
import {createOrgEntry} from '../utils/org-helpers'
import {makeStyles} from '@material-ui/core/styles'
import {useFormInput} from '../utils/custom-hooks'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from '@material-ui/pickers'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

const clickHandler = ({text, dispatch, selectedRow, changes}) => {
  const textArr = text.split('\n')

  const newText = [...textArr, ...createOrgEntry(changes)].join('\n')
  dispatch({type: 'setText', payload: newText})
  saveChanges({selectedRow, newText})
}

const joinDates = (date, time) => {
  const newDate =
    date &&
    time &&
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
    )
  return (newDate || '').toString()
}

const TimestampDialog = ({label}) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)

  return (
    <div>
      <TextField
        id='section-text-add'
        label='Timestamp'
        style={inputStyle}
        margin='normal'
        value={joinDates(date, time)}
        onClick={() => setOpen(true)}
      />

      <Button
        color='primary'
        onClick={() => {
          setDate(null)
          setTime(null)
        }}
      >
        CLEAR
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='timestamp-dialog-title'
        aria-describedby='timestamp-dialog-description'
      >
        <DialogTitle id='timestamp-dialog-title'>{label}</DialogTitle>
        <DialogContent>
          <KeyboardDatePicker
            style={{...inputStyle, ...datePickerMargin}}
            label={`${label} DATE`}
            clearable
            value={date}
            onChange={date => setDate(date)}
            format='yyyy/MM/dd'
          />
          <TimePicker
            style={{...inputStyle, ...datePickerMargin}}
            label={`${label} TIME`}
            clearable
            value={time}
            onChange={date => setTime(date)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color='primary' autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  label: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  selectArea: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}))

const inputStyle = {width: '90%', marginRight: '5px', marginLeft: '5px'}
const datePickerMargin = {marginTop: '1rem', marginBottom: '1rem'}

export default ({shouldSubmit}) => {
  const {text, selectedRow, dispatch} = useContext(StoreContext)
  const classes = useStyles()
  const level = useFormInput('1')
  const headlineText = useFormInput('')
  const todoState = useFormInput('')
  const priority = useFormInput('')
  const sectionText = useFormInput('')

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
        },
      })

      dispatch({type: 'setMode', payload: {type: 'View', payload: null}})
    }
    if (shouldSubmit === 'CancelChanges') {
      dispatch({type: 'setMode', payload: {type: 'View', payload: null}})
    }
  }, [shouldSubmit])

  return (
    <div>
      <div>
        <TextField
          id='headline-level-add'
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
          id='headline-text-add'
          label='Headline'
          className={classes.textField}
          style={inputStyle}
          margin='normal'
          {...headlineText}
        />
      </div>
      <div>
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
          id='section-text-add'
          label='Content'
          multiline
          className={classes.textField}
          style={inputStyle}
          margin='normal'
          {...sectionText}
        />
      </div>
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div>
            <TimestampDialog label='TIMESTAMP' />
          </div>
        </MuiPickersUtilsProvider>
      </div>
    </div>
  )
}
