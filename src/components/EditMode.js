import React, { useEffect, useContext } from 'react'
import { StoreContext } from './Store'
import { useFormInput } from '../utils/custom-hooks'
import { saveChanges } from '../utils/file-helpers'
import { createOrgEntry } from '../utils/org-helpers'
import { makeStyles } from '@material-ui/core/styles'
import { getRange } from '../utils/node-helpers'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'

const getHeadlineText = editNode =>
  editNode.content.map(content => content.text)

const sectionFilter = x => x.type === 'section'

const getSectionText = editNode =>
  editNode.children
    .filter(sectionFilter)
    .map(x => x.content.map(x => x.text))
    .join('\n')

const deleteNode = ({ editNode, text, setText, selectedRow }) => {
  const deleteRange = getRange(editNode)
  const textArr = text.split('\n')

  const newText = [
    ...textArr.slice(0, deleteRange.start),
    ...textArr.slice(deleteRange.end + 1),
  ].join('\n')

  setText(newText)
  saveChanges({ selectedRow, newText })
}

const clickHandler = ({ editNode, text, setText, selectedRow, changes }) => {
  const editRange = getRange(editNode)
  const textArr = text.split('\n')

  const newText = [
    ...textArr.slice(0, editRange.start),
    ...createOrgEntry(changes),
    ...textArr.slice(editRange.end + 1),
  ].join('\n')

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

export default ({ shouldSubmit, selectedRow }) => {
  const { text, setText, mode, setMode } = useContext(StoreContext)

  if (!mode.payload) return <div />

  const editNode = mode.payload

  const classes = useStyles()

  const level = useFormInput(editNode.level)
  const headlineText = useFormInput(getHeadlineText(editNode))
  const todoState = useFormInput(editNode.State ? editNode.State : '')
  const priority = useFormInput(editNode.priority ? editNode.priority : '')
  const sectionText = useFormInput(getSectionText(editNode))

  useEffect(() => {
    if (shouldSubmit === 'SaveChanges') {
      clickHandler({
        editNode,
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

    if (shouldSubmit === 'Delete') {
      deleteNode({ editNode, text, setText, selectedRow })
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
          id="headline-level-edit"
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
          id="headline-text-edit"
          label="Headline"
          className={classes.textField}
          style={inputStyle}
          margin="normal"
          {...headlineText}
        />
      </div>
      <div className={classes.selectArea}>
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
          id="section-text-edit"
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
