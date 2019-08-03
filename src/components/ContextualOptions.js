import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const DoubleTapContainer = styled.div`
  user-select: none;
`

const SingleTapContainer = styled.div`
  user-select: none;
`

export default ({ editItem, moveItem, mode, children }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = () => setAnchorEl(true)

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
      {anchorEl && (
        <Menu
          id="context-menu"
          title="context-menu"
          anchorEl={ref.current}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => editItem()}>Edit Item</MenuItem>
          <MenuItem onClick={() => moveItem()}>Move Item</MenuItem>
          <MenuItem onClick={() => console.log('url opened')}>
            Open Url
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  )
}
