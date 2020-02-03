import React, { useState } from 'react'
import Dialog, { DialogTitle, DialogContent, DialogFooter } from '@material/react-dialog'
import Button from '@material/react-button'
import { getRange } from '../utils/node-helpers'
import { saveChanges } from '../utils/file-helpers'
import Menu, { MenuList, MenuListItem } from '@material/react-menu'

const deleteNode = ({ editNode, text, dispatch, selectedRow }) => {
  const deleteRange = getRange(editNode)
  const textArr = text.split('\n')

  const newText = [
    ...textArr.slice(0, deleteRange.start),
    ...textArr.slice(deleteRange.end + 1)
  ].join('\n')

  dispatch({ type: 'setText', payload: newText })
  saveChanges({ selectedRow, newText })
}

export default ({ editItem, moveItem, mode, deleteNodeProps, toggleTodoProps, children }) => {
  const [open, setOpen] = useState(false)
  const [coordinates, setCoordinates] = useState(undefined)
  const [deleting, setDeleting] = useState(false)

  const handleClose = () => setCoordinates(null)

  const handleClick = event => {
    setOpen(true)
    setCoordinates({ x: event.clientX, y: event.clientY })
    event.preventDefault()
    return false
  }

  return (
    <React.Fragment>
      {mode.type === 'View' && (
        <div className='no-user-select' onClick={handleClick}>
          {children}
        </div>
      )}
      {mode.type === 'Move' && (
        <div className='no-user-select' onClick={() => moveItem()}>
          {children}
        </div>
      )}
      {coordinates && (
        <Menu
          id='context-menu'
          title='context-menu'
          coordinates={coordinates}
          open={Boolean(open)}
          onClose={handleClose}>
          <MenuList>
            {editItem && (
              <MenuListItem
                onClick={() => {
                  editItem()
                  handleClose()
                }}>
                Edit
              </MenuListItem>
            )}
            {moveItem && (
              <MenuListItem
                onClick={() => {
                  moveItem()
                  handleClose()
                }}>
                Move
              </MenuListItem>
            )}
            {toggleTodoProps && (
              <MenuListItem
                onClick={() => {
                  toggleTodoState(toggleTodoProps)
                  repeaterAdvance(toggleTodoProps)
                  handleClose()
                }}>
                Cycle TODO
              </MenuListItem>
            )}
            {deleteNodeProps && (
              <MenuListItem onClick={() => setDeleting(true)}>Delete</MenuListItem>
            )}
          </MenuList>
        </Menu>
      )}
      {deleting && (
        <Dialog
          open={deleting}
          onClose={() => setDeleting(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'>'Delete This Item?'</DialogTitle>
          <DialogContent>Are you sure you intend to delete this item?</DialogContent>
          <DialogFooter onClick={() => handleClose()}>
            <Button
              onClick={() => {
                handleClose()
                setDeleting(false)
              }}
              color='primary'>
              Cancel
            </Button>
            <Button onClick={() => deleteNode()} color='primary' autoFocus>
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </React.Fragment>
  )
}
