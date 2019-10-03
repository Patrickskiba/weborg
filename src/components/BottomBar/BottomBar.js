import React, { useEffect, useState, useContext } from 'react'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/MoreVert'
import MenuIcon from '@material-ui/icons/Menu'
import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'
import DeleteNode from '../DeleteNode'
import AddNoteFab from '../AddNoteFab'
import { get } from 'idb-keyval'
import { StoreContext } from '../Store'
import { authenticateUser } from '../../utils/dropbox-files'
import { saveChanges } from '../../utils/file-helpers'

export default ({ sideBarVisible, setSideBarVisible, setShouldSubmit }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = event => setAnchorEl(event.currentTarget)

  useEffect(() => {
    setShouldSubmit()
  })

  return (
    <>
      <AddNoteFab />
      <div className='mdc-bottom-app-bar__fab mdc-bottom-app-bar__fab--center-cut mdc-fab material-icons' />
      <div className='mdc-bottom-app-bar__row'>
        <section className='mdc-bottom-app-bar__section mdc-bottom-app-bar__section--align-start'>
          <IconButton
            title='toggle-file-explorer'
            onClick={() => setSideBarVisible(!sideBarVisible)}
            edge='start'
            color='inherit'
            aria-label='Menu'>
            <MenuIcon />
          </IconButton>
          <Typography data-testid='filename-titlebar' variant='h6'>
            {selectedRow}
          </Typography>
          {(mode.type === 'Add' || mode.type === 'Edit') && (
            <React.Fragment>
              <Check
                className='topbar-icon'
                color='inherit'
                title='save'
                onClick={() => setShouldSubmit('SaveChanges')}
              />
              <Close
                className='topbar-icon'
                color='inherit'
                title='cancel'
                onClick={() => setShouldSubmit('CancelChanges')}
              />
            </React.Fragment>
          )}

          {mode.type === 'Move' && (
            <React.Fragment>
              <Check
                className='topbar-icon'
                title='move-mode-save'
                color='inherit'
                onClick={() => {
                  saveChanges({ selectedRow, newText: text })
                  dispatch({
                    type: 'setMode',
                    payload: { type: 'View', payload: null }
                  })
                }}
              />
              <Close
                className='topbar-icon'
                title='move-mode-cancel'
                color='inherit'
                onClick={() => {
                  get(selectedRow).then(text => dispatch({ type: 'setText', payload: text }))
                  dispatch({
                    type: 'setMode',
                    payload: { type: 'View', payload: null }
                  })
                }}
              />
            </React.Fragment>
          )}

          <SettingsIcon title='SettingsIcon' color='inherit' onClick={handleClick} />
          <Menu
            id='simple-menu'
            title='options-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <div onClick={authenticateUser}>Link To Dropbox</div>
            </MenuItem>

            {mode.type === 'View' && (
              <MenuItem
                onClick={() => {
                  handleClose()
                  dispatch({
                    type: 'setMode',
                    payload: { type: 'Move', payload: null }
                  })
                }}>
                <div>Move Items</div>
              </MenuItem>
            )}

            {mode.type === 'Edit' && (
              <DeleteNode handleClose={handleClose} clickHandler={() => setShouldSubmit('Delete')}>
                Delete Item
              </DeleteNode>
            )}
          </Menu>
        </section>
      </div>
    </>
  )
}
