import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const DoubleTapContainer = styled.div`
  user-select: none;
`

const EditItemOption = () => (
  <MenuItem onClick={() => console.log('edit')}>Edit Item</MenuItem>
)

const MoveItemOption = () => (
  <MenuItem onClick={() => console.log('move')}>Move Item</MenuItem>
)

const OpenUrlOption = () => (
  <MenuItem onClick={() => console.log('url opened')}>Open Url</MenuItem>
)

export default ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = () => setAnchorEl(true)

  return (
    <React.Fragment>
      <DoubleTapContainer onDoubleClick={handleClick} ref={ref}>
        {children}
      </DoubleTapContainer>
      {anchorEl && (
        <Menu
          id="context-menu"
          title="context-menu"
          anchorEl={ref.current}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <EditItemOption />
          <MoveItemOption />
          <OpenUrlOption />
        </Menu>
      )}
    </React.Fragment>
  )
}
