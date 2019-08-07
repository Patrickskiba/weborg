import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteNode, { deleteNode } from './DeleteNode'
import { toggleTodoState } from '../utils/org-helpers'

const DoubleTapContainer = styled.div`
  user-select: none;
`

const SingleTapContainer = styled.div`
  user-select: none;
`

export default ({
  editItem,
  moveItem,
  mode,
  deleteNodeProps,
  toggleTodoProps,
  children,
}) => {
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
        <DoubleTapContainer onDoubleClick={handleClick} ref={ref}>
          {children}
        </DoubleTapContainer>
      )}
      {mode.type === 'Move' && (
        <SingleTapContainer onClick={() => moveItem()}>
          {children}
        </SingleTapContainer>
      )}
      {anchorType && (
        <Menu
          id="context-menu"
          title="context-menu"
          anchorEl={ref.current}
          keepMounted
          open={Boolean(anchorType)}
          onClose={handleClose}
        >
          {editItem && (
            <MenuItem
              onClick={() => {
                editItem()
                handleClose()
              }}
            >
              Edit
            </MenuItem>
          )}
          {moveItem && (
            <MenuItem
              onClick={() => {
                moveItem()
                handleClose()
              }}
            >
              Move
            </MenuItem>
          )}
          {toggleTodoProps && (
            <MenuItem
              onClick={() => {
                toggleTodoState(toggleTodoProps)
                handleClose()
              }}
            >
              Cycle TODO
            </MenuItem>
          )}
          {deleteNodeProps && (
            <DeleteNode
              handleClose={handleClose}
              clickHandler={() => deleteNode(deleteNodeProps)}
            >
              Delete
            </DeleteNode>
          )}
          {anchorType.tagName === 'A' && (
            <MenuItem
              onClick={() => {
                window.location.href = anchorType.href
              }}
            >
              Open Url
            </MenuItem>
          )}
        </Menu>
      )}
    </React.Fragment>
  )
}
