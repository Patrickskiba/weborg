import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import { makeStyles } from '@material-ui/core/styles'
import { generateDateString, formatDateTime, convert24hrTo12hr } from '../utils/date-helpers'

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '90%'
  }
}))

export default ({ label, dateTime, setDateTime }) => {
  const classes = useStyles()
  const [frequencyType, setFrequencyType] = useState('+')
  const [frequency, setFrequency] = useState('y')
  const [timeInterval, setTimeInterval] = useState('1')

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
                    date: dt.date || generateDateString(new Date()),
                    time: e.target.value,
                    dateTime: formatDateTime({
                      date: dt.date || generateDateString(new Date()),
                      time: convert24hrTo12hr(e.target.value)
                    })
                  }))
                }}
              />
            </div>
          </div>
          <div>
            <input
              type='radio'
              id='standard-repeat'
              value='+'
              onChange={() => setFrequencyType('+')}
              checked={frequencyType === '+'}
            />
            <label htmlFor='standard-repeat'>+</label>

            <input
              type='radio'
              id='move-to-future-repeat'
              value='++'
              onChange={() => setFrequencyType('++')}
              checked={frequencyType === '++'}
            />
            <label htmlFor='move-to-future-repeat'>++</label>

            <input
              type='radio'
              id='future-from-current-date-repeat'
              value='.+'
              onChange={() => setFrequencyType('.+')}
              checked={frequencyType === '.+'}
            />
            <label htmlFor='future-from-current-date-repeat'>.+</label>
          </div>

          <div>
            <input
              type='radio'
              id='yearly-repeat'
              value='y'
              onChange={() => setFrequency('y')}
              checked={frequency === 'y'}
            />
            <label htmlFor='yearly-repeat'>y</label>

            <input
              type='radio'
              id='monthly-repeat'
              value='m'
              onChange={() => setFrequency('m')}
              checked={frequency === 'm'}
            />
            <label htmlFor='monthly-repeat'>m</label>

            <input
              type='radio'
              id='weekly-repeat'
              value='w'
              onChange={() => setFrequency('w')}
              checked={frequency === 'w'}
            />
            <label htmlFor='weekly-repeat'>w</label>

            <input
              type='radio'
              id='daily-repeat'
              value='d'
              onChange={() => setFrequency('d')}
              checked={frequency === 'd'}
            />
            <label htmlFor='daily-repeat'>d</label>

            <input
              type='radio'
              id='hourly-repeat'
              value='h'
              onChange={() => setFrequency('h')}
              checked={frequency === 'h'}
            />
            <label htmlFor='hourly-repeat'>h</label>
          </div>
          <div>
            <label htmlFor='repeat-value'>Repeat Value</label>
            <input
              type='text'
              id='repeat-value'
              onChange={e => setTimeInterval(e.target.value)}
              value={timeInterval}
            />
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
