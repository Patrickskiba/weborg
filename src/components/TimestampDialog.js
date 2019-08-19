import React, {useEffect, useState} from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import {KeyboardDatePicker, TimePicker} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

const datePickerMargin = {marginTop: '1rem', marginBottom: '1rem'}
const inputStyle = {width: '90%', marginRight: '5px', marginLeft: '5px'}

const joinDates = (date, time) => {
  const dateFns = new DateFnsUtils()

  if (date && time) {
    return dateFns.format(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
      ),
      'yyyy-MM-dd E hh:mm:a',
    )
  }

  if (date) {
    return dateFns.format(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      'yyyy-MM-dd E',
    )
  }

  return ''.toString()
}

export default ({label, dateTime, setDateTime}) => {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)

  useEffect(() => {
    setDateTime(joinDates(date, time))
  }, [date, time])

  return (
    <div>
      <TextField
        id='section-text-add'
        label={label}
        style={inputStyle}
        margin='normal'
        value={dateTime}
        onClick={() => setOpen(true)}
      />

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
          <Button
            color='primary'
            onClick={() => {
              setDate(null)
              setTime(null)
            }}
          >
            CLEAR
          </Button>
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
