import React, { useState, useContext, useEffect } from 'react'
import { SelectedFileContext } from './App'
import { set } from 'idb-keyval'
import { saveFile } from '../utils/dropboxFiles'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const getHeadlineText = editNode =>
  editNode.content.map(content => content.text)

const sectionFilter = x => x.type === 'section'

const getSectionText = editNode =>
  editNode.children
    .filter(sectionFilter)
    .map(x => x.content.map(x => x.text))
    .join('\n')

const getLineNumberRange = editNode => ({
  start: editNode.index,
  end: getSectionText(editNode)
    ? editNode.children.filter(sectionFilter).slice(-1)[0].index
    : editNode.index,
})

const saveChanges = ({ editNode, text, changes }) => {
  const createOrgEntry = ({ level, headlineText, sectionText }) =>
    `${'*'.repeat(level)} ${headlineText}\n${sectionText}`

  const editRange = getLineNumberRange(editNode)
  const textArr = text.split('\n')

  return [
    ...textArr.slice(0, editRange.start),
    ...createOrgEntry(changes).split('\n'),
    ...textArr.slice(editRange.end + 1),
  ].join('\n')
}

const clickHandler = ({ editNode, text, setText, selectedRow, changes }) => {
  const newText = saveChanges({ editNode, text, changes })
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

export default ({ editNode, setEditNode, text, setText, shouldSubmit }) => {
  if (!editNode) return <div />

  const classes = useStyles()

  const level = useFormInput(editNode.level)
  const headlineText = useFormInput(getHeadlineText(editNode))
  const sectionText = useFormInput(getSectionText(editNode))
  const selectedRow = useContext(SelectedFileContext)

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
          sectionText: sectionText.value,
        },
      })
      setEditNode()
    }
    if (shouldSubmit === 'CancelChanges') {
      setEditNode()
    }
  })

  return (
    <div>
      <div>
        <TextField
          id="headline-level"
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
          id="headline-text"
          label="Level"
          className={classes.textField}
          style={inputStyle}
          margin="normal"
          {...headlineText}
        />
      </div>
      <div>
        <TextField
          id="headline-text"
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
