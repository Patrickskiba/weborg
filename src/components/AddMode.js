import React, { useEffect } from 'react'
import { saveChanges } from '../utils/file-helpers'
import { createOrgEntry } from '../utils/org-helpers'
import { makeStyles } from '@material-ui/core/styles'
import { useFormInput } from '../utils/custom-hooks'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const clickHandler = ({ text, setText, selectedRow, changes }) => {
  const textArr = text.split('\n')

  const newText = [...textArr, ...createOrgEntry(changes)].join('\n')
  setText(newText)
  saveChanges({ selectedRow, newText })
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

const inputStyle = { width: '90%', marginRight: '5px', marginLeft: '5px' }

export default ({ setMode, text, setText, shouldSubmit, selectedRow }) => {
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
        setText,
        selectedRow,
        changes: {
          level: level.value,
          headlineText: headlineText.value,
          todoState: todoState.value,
          priority: priority.value,
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
      <div className={classes.selectArea}>
        <InputLabel
          className={classes.label}
          shrink
          htmlFor="priority-label-placeholder"
        >
          Priority
        </InputLabel>
        <Select
          id="priority-edit"
          style={inputStyle}
          displayEmpty
          input={<Input name="Priority" id="priority-label-placeholder" />}
          name="Priority"
          {...priority}
        >
          <MenuItem value="">
            <em>none</em>
          </MenuItem>
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
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
