import React, { useEffect, useState, useContext } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
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

  const [showAgenda, setShowAgenda] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = event => setAnchorEl(event.currentTarget)

  useEffect(() => {
    setShouldSubmit()
  }, [mode])

  return (
    <>
      <AddNoteFab />
      <div className='mdc-bottom-app-bar__fab mdc-bottom-app-bar__fab--center-cut mdc-fab material-icons' />
      <div className='mdc-bottom-app-bar__row'>
        <div className='mdc-bottom-app-bar__section mdc-bottom-app-bar__section--space-around'>
          <div onClick={() => setSideBarVisible(!sideBarVisible)}>
            <i
              title='toggle-file-explorer'
              aria-label='Menu'
              className='material-icons mdc-bottom-app-bar-icon'>
              menu
            </i>
          </div>
          <div>
            <i className='material-icons mdc-bottom-app-bar-icon'>search</i>
          </div>
          <div onClick={() => dispatch({ type: 'setMode', payload: { type: 'Agenda' } })}>
            <i className='material-icons mdc-bottom-app-bar-icon'>calendar_today</i>
          </div>
          <div>
            <i
              className='material-icons mdc-bottom-app-bar-icon'
              title='SettingsIcon'
              onClick={handleClick}>
              settings
            </i>
          </div>
          <div data-testid='filename-titlebar' className='mdc-bottom-app-bar-text'>
            {selectedRow.length >= 21 ? `${selectedRow.substring(0, 20)}...` : selectedRow}
          </div>
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
        </div>
      </div>
    </>
  )
}
