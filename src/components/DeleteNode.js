import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import MenuItem from '@material-ui/core/MenuItem'
import { getRange } from '../utils/node-helpers'
import { saveChanges } from '../utils/file-helpers'

export const deleteNode = ({ editNode, text, dispatch, selectedRow }) => {
  const deleteRange = getRange(editNode)
  const textArr = text.split('\n')

  const newText = [
    ...textArr.slice(0, deleteRange.start),
    ...textArr.slice(deleteRange.end + 1)
  ].join('\n')

  dispatch({ type: 'setText', payload: newText })
  saveChanges({ selectedRow, newText })
}

export default ({ clickHandler, handleClose, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>
        <div>{children}</div>
      </MenuItem>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>'Delete This Item?'</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you intend to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions onClick={handleClose}>
          <Button
            onClick={() => {
              handleClose()
              setOpen(false)
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button onClick={clickHandler} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
