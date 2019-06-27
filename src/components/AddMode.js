import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { set } from 'idb-keyval'
import React, { useEffect, useState } from 'react'
import { saveFile } from '../utils/dropbox-files'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const saveChanges = ({ text, changes }) => {
  const createOrgEntry = ({ level, headlineText, todoState, sectionText }) =>
    `${'*'.repeat(level)} ${todoState} ${headlineText}\n${sectionText}`

  const textArr = text.split('\n')

  return [...textArr, ...createOrgEntry(changes).split('\n')].join('\n')
}

const clickHandler = ({ text, setText, selectedRow, changes }) => {
  const newText = saveChanges({ text, changes })
  setText(newText)
  set(selectedRow, newText)
  saveFile({ file: selectedRow, newText })
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
}))

const inputStyle = { width: '90%', marginRight: '5px', marginLeft: '5px' }

export default ({ setMode, text, setText, shouldSubmit, selectedRow }) => {
  const classes = useStyles()
  const level = useFormInput('1')
  const headlineText = useFormInput('')
  const todoState = useFormInput('')
  const sectionText = useFormInput('')

  useEffect(() => {
    if (shouldSubmit === 'SaveChanges') {
      clickHandler({
        text,
        setText,
        selectedRow,
        changes: {
          level: level.value,
          headlineText: headlineText.value,
          todoState: todoState.value,
          sectionText: sectionText.value,
        },
      })

      setMode({ type: 'View', payload: null })
    }
    if (shouldSubmit === 'CancelChanges') {
      setMode({ type: 'View', payload: null })
    }
  })

  return (
    <div>
      <div>
        <TextField
          id="headline-level-add"
          label="Level"
          type="number"
          className={classes.textField}
          style={inputStyle}
          margin="normal"
          {...level}
        />
      </div>
      <div>
        <TextField
          id="headline-text-add"
          label="Headline"
          className={classes.textField}
          style={inputStyle}
          margin="normal"
          {...headlineText}
        />
      </div>
      <div>
        <InputLabel
          className={classes.label}
          shrink
          htmlFor="state-label-placeholder"
        >
          State
        </InputLabel>
        <Select
          id="todo-state-edit"
          style={inputStyle}
          displayEmpty
          input={<Input name="State" id="state-label-placeholder" />}
          name="State"
          {...todoState}
        >
          <MenuItem value="">
            <em>none</em>
          </MenuItem>
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="DONE">DONE</MenuItem>
        </Select>
      </div>
      <div>
        <TextField
          id="section-text-add"
          label="Content"
          multiline
          className={classes.textField}
          style={inputStyle}
          margin="normal"
          {...sectionText}
        />
      </div>
    </div>
  )
}

const useFormInput = initialValue => {
  const [value, setVal] = useState(initialValue)

  const onChange = e => setVal(e.target.value)

  return { value, onChange }
}
