import React, { useState } from 'react'
import Button from '@material/react-button'
import Dialog, { DialogTitle, DialogContent, DialogFooter } from '@material/react-dialog'
import TextField, { Input } from '@material/react-text-field'
import { generateDateString, formatDateTime, convert24hrTo12hr } from '../utils/date-helpers'

const useFrequency = frequency => {
  let prefill
  if (frequency) {
    prefill = [
      frequency.match(/(\+\+|\+|\.\+)/)[0],
      frequency.match(/\d+/)[0],
      frequency.match(/(y|m|w|d|h)/)[0]
    ]
  }
  const [frequencyType, setFrequencyType] = useState(prefill ? prefill[0] : '+')
  const [frequencyInterval, setFrequencyInterval] = useState(prefill ? prefill[1] : '1')
  const [frequencyPeriod, setFrequencyPeriod] = useState(prefill ? prefill[2] : 'y')

  return {
    frequencyType,
    setFrequencyType,
    frequencyPeriod,
    setFrequencyPeriod,
    frequencyInterval,
    setFrequencyInterval
  }
}

export default ({ label, dateTime, setDateTime }) => {
  const [date, setDate] = useState(dateTime.date || generateDateString(new Date()))
  const [time, setTime] = useState(dateTime.time)

  const [isReoccuring, setIsReoccuring] = useState(!!dateTime.frequency || false)
  const frequency = useFrequency(dateTime.frequency)

  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className='full-length-input row'
        onClick={e => {
          setOpen(true)
        }}>
        <TextField
          outlined
          label={label}
          htmlFor={label}
          className='full-length-input'
          value={dateTime.dateTime}
          trailingIcon={<i className='material-icons'>calendar_today</i>}>
          <Input id={label} data-testid={label} readOnly value={dateTime.dateTime} />
        </TextField>
      </div>

      {open && (
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
                  value={date}
                  role='date-picker'
                  onChange={e => {
                    e.persist()
                    setDate(e.target.value)
                  }}
                />
              </div>
              <div className='datetime-margin'>
                <label htmlFor={`time-${label}`}>Time:</label>
                <input
                  type='time'
                  id={`time-${label}`}
                  value={time}
                  role='time-picker'
                  onChange={e => {
                    e.persist()
                    setTime(e.target.value)
                  }}
                />
              </div>
            </div>
            <div>
              Repeat Task:{' '}
              <input
                type='checkbox'
                onChange={() => setIsReoccuring(val => !val)}
                checked={isReoccuring}
              />
            </div>
            {isReoccuring && (
              <div>
                <div>
                  <input
                    type='radio'
                    id='standard-repeat'
                    value='+'
                    onChange={() => frequency.setFrequencyType('+')}
                    checked={frequency.frequencyType === '+'}
                  />
                  <label htmlFor='standard-repeat'>+</label>

                  <input
                    type='radio'
                    id='move-to-future-repeat'
                    value='++'
                    onChange={() => frequency.setFrequencyType('++')}
                    checked={frequency.frequencyType === '++'}
                  />
                  <label htmlFor='move-to-future-repeat'>++</label>

                  <input
                    type='radio'
                    id='future-from-current-date-repeat'
                    value='.+'
                    onChange={() => frequency.setFrequencyType('.+')}
                    checked={frequency.frequencyType === '.+'}
                  />
                  <label htmlFor='future-from-current-date-repeat'>.+</label>
                </div>

                <div>
                  <input
                    type='radio'
                    id='yearly-repeat'
                    value='y'
                    onChange={() => frequency.setFrequencyPeriod('y')}
                    checked={frequency.frequencyPeriod === 'y'}
                  />
                  <label htmlFor='yearly-repeat'>y</label>

                  <input
                    type='radio'
                    id='monthly-repeat'
                    value='m'
                    onChange={() => frequency.setFrequencyPeriod('m')}
                    checked={frequency.frequencyPeriod === 'm'}
                  />
                  <label htmlFor='monthly-repeat'>m</label>

                  <input
                    type='radio'
                    id='weekly-repeat'
                    value='w'
                    onChange={() => frequency.setFrequencyPeriod('w')}
                    checked={frequency.frequencyPeriod === 'w'}
                  />
                  <label htmlFor='weekly-repeat'>w</label>

                  <input
                    type='radio'
                    id='daily-repeat'
                    value='d'
                    onChange={() => frequency.setFrequencyPeriod('d')}
                    checked={frequency.frequencyPeriod === 'd'}
                  />
                  <label htmlFor='daily-repeat'>d</label>

                  <input
                    type='radio'
                    id='hourly-repeat'
                    value='h'
                    onChange={() => frequency.setFrequencyPeriod('h')}
                    checked={frequency.frequencyPeriod === 'h'}
                  />
                  <label htmlFor='hourly-repeat'>h</label>
                </div>
                <div>
                  <label htmlFor='repeat-value'>Repeat Value</label>
                  <input
                    type='text'
                    id='repeat-value'
                    onChange={e => frequency.setFrequencyInterval(e.target.value)}
                    value={frequency.frequencyInterval}
                  />
                </div>
              </div>
            )}
          </DialogContent>
          <DialogFooter>
            <Button
              color='primary'
              onClick={() => {
                setDateTime({ dateTime: '', date: '', time: '' })
                setDate('')
                setTime('')
              }}>
              CLEAR
            </Button>
            <Button onClick={() => setOpen(false)} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDateTime(dt => ({
                  date: date,
                  time: time,
                  frequency: isReoccuring
                    ? frequency.frequencyType +
                      frequency.frequencyInterval +
                      frequency.frequencyPeriod
                    : '',
                  dateTime: formatDateTime({
                    date: date,
                    time: convert24hrTo12hr(time),
                    frequency: isReoccuring
                      ? frequency.frequencyType +
                        frequency.frequencyInterval +
                        frequency.frequencyPeriod
                      : ''
                  })
                }))
                setOpen(false)
              }}
              color='primary'>
              Submit
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  )
}
