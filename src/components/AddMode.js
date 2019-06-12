import React, { useState, useContext, useEffect } from 'react'
import { SelectedFileContext } from './App'
import { set } from 'idb-keyval'
import { saveFile } from '../utils/dropboxFiles'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const saveChanges = ({ text, changes }) => {
  const createOrgEntry = ({ level, headlineText, sectionText }) =>
    `${'*'.repeat(level)} ${headlineText}\n${sectionText}`

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
}))

const inputStyle = { width: '90%', marginRight: '5px', marginLeft: '5px' }

export default ({ setMode, text, setText, shouldSubmit }) => {
  const classes = useStyles()
  const level = useFormInput('1')
  const headlineText = useFormInput('')
  const sectionText = useFormInput('')
  const selectedRow = useContext(SelectedFileContext)

  useEffect(() => {
    if (shouldSubmit === 'SaveChanges') {
      clickHandler({
        text,
        setText,
        selectedRow,
        changes: {
          level: level.value,
          headlineText: headlineText.value,
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
        <TextField
          id="headline-text-add"
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