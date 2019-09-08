import React, { useState, useRef } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteNode, { deleteNode } from './DeleteNode'
import { toggleTodoState } from '../utils/org-helpers'

export default ({ editItem, moveItem, mode, deleteNodeProps, toggleTodoProps, children }) => {
  const [anchorType, setAnchorType] = useState(null)
  const ref = useRef(null)

  const handleClose = () => setAnchorType(null)

  const handleClick = event => {
    setAnchorType(event.target)
    return false
  }

  return (
    <React.Fragment>
      {mode.type === 'View' && (
        <div className='no-user-select' onDoubleClick={handleClick} ref={ref}>
          {children}
        </div>
      )}
      {mode.type === 'Move' && (
        <div className='no-user-select' onClick={() => moveItem()}>
          {children}
        </div>
      )}
      {anchorType && (
        <Menu
          id='context-menu'
          title='context-menu'
          anchorEl={ref.current}
          keepMounted
          open={Boolean(anchorType)}
          onClose={handleClose}>
          {editItem && (
            <MenuItem
              onClick={() => {
                editItem()
                handleClose()
              }}>
              Edit
            </MenuItem>
          )}
          {moveItem && (
            <MenuItem
              onClick={() => {
                moveItem()
                handleClose()
              }}>
              Move
            </MenuItem>
          )}
          {toggleTodoProps && (
            <MenuItem
              onClick={() => {
                toggleTodoState(toggleTodoProps)
                handleClose()
              }}>
              Cycle TODO
            </MenuItem>
          )}
          {deleteNodeProps && (
            <DeleteNode handleClose={handleClose} clickHandler={() => deleteNode(deleteNodeProps)}>
              Delete
            </DeleteNode>
          )}
          {anchorType.tagName === 'A' && (
            <MenuItem
              onClick={() => {
                window.location.href = anchorType.href
              }}>
              Open Url
            </MenuItem>
          )}
        </Menu>
      )}
    </React.Fragment>
  )
}
