import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { makeStyles } from '@material-ui/core/styles'
import { formatDateTime } from '../utils/date-helpers'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%'
  }
}))

const convert24hrTo12hr = t => {
  const time = (t || '').match(/^\d\d:\d\d$/)
  if (time) {
    const hr = time[0].substring(0, 2)

    if (hr === '00') {
      return `12:${time[0].slice(3)}:AM`
    }

    if (hr === '12') {
      return `12:${time[0].slice(3)}:PM`
    }

    if (hr > 12) {
      const formatedHour = `${hr - 12}`.padStart(2, '0')
      return `${formatedHour}:${time[0].slice(3)}:PM`
    }

    if (hr <= 12) {
      return `${hr}:${time[0].slice(3)}:AM`
    }
  }
  return t
}

export default ({ label, dateTime, setDateTime }) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)

  return (
    <div>
      <TextField
        id={`${label}-textfield`}
        label={label}
        className={classes.textField}
        margin='normal'
        value={dateTime.dateTime}
        onClick={() => setOpen(true)}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='timestamp-dialog-title'
        aria-describedby='timestamp-dialog-description'>
        <DialogTitle id='timestamp-dialog-title'>{label}</DialogTitle>
        <DialogContent>
          <div className='datetime-container'>
            <div className='datetime-margin'>
              <label htmlFor={`date-${label}`}>Date:</label>
              <input
                type='date'
                id={`date-${label}`}
                value={dateTime.date}
                role='date-picker'
                onChange={e => {
                  e.persist()
                  setDateTime(dt => ({
                    date: e.target.value,
                    time: dt.time,
                    dateTime: formatDateTime({
                      date: e.target.value,
                      time: convert24hrTo12hr(dt.time)
                    })
                  }))
                }}
              />
            </div>
            <div className='datetime-margin'>
              <label htmlFor={`time-${label}`}>Time:</label>
              <input
                type='time'
                id={`time-${label}`}
                value={dateTime.time}
                role='time-picker'
                onChange={e => {
                  e.persist()
                  setDateTime(dt => ({
                    date: dt.date,
                    time: e.target.value,
                    dateTime: formatDateTime({
                      date: dt.date,
                      time: convert24hrTo12hr(e.target.value)
                    })
                  }))
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color='primary'
            onClick={() => {
              setDateTime({ dateTime: '', date: '', time: '' })
            }}>
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
