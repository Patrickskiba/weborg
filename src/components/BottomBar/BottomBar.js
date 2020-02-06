import React, { useEffect, useState, useContext } from 'react'
import Menu, { MenuList, MenuListItem } from '@material/react-menu'
import { DeleteModal } from '../NoteMenu'
import AddNoteFab from '../AddNoteFab'
import { get } from 'idb-keyval'
import { StoreContext } from '../Store'
import { authenticateUser } from '../../utils/dropbox-files'
import { saveChanges } from '../../utils/file-helpers'

export default ({ sideBarVisible, setSideBarVisible, setShouldSubmit }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)

  const [open, setOpen] = useState(false)

  const [deleting, setDeleting] = useState(false)

  const [coordinates, setCoordinates] = useState(undefined)

  const handleClose = () => setCoordinates(null)

  const handleClick = event => {
    setOpen(true)
    setCoordinates({ x: event.clientX, y: event.clientY })
    event.preventDefault()
    return false
  }

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
              <i
                className='material-icons topbar-icon'
                title='save'
                onClick={() => setShouldSubmit('SaveChanges')}>
                check
              </i>
              <i
                className='material-icons topbar-icon'
                title='cancel'
                onClick={() => setShouldSubmit('CancelChanges')}>
                close
              </i>
            </React.Fragment>
          )}

          {mode.type === 'Move' && (
            <React.Fragment>
              <i
                className='topbar-icon'
                title='move-mode-save'
                onClick={() => {
                  saveChanges({ selectedRow, newText: text })
                  dispatch({
                    type: 'setMode',
                    payload: { type: 'View', payload: null }
                  })
                }}>
                check
              </i>
              <i
                className='topbar-icon'
                title='move-mode-cancel'
                onClick={() => {
                  get(selectedRow).then(text => dispatch({ type: 'setText', payload: text }))
                  dispatch({
                    type: 'setMode',
                    payload: { type: 'View', payload: null }
                  })
                }}>
                close
              </i>
            </React.Fragment>
          )}

          {deleting && (
            <DeleteModal
              deleting={deleting}
              setDeleting={setDeleting}
              handleSubmit={() => {
                setShouldSubmit('Delete')
              }}
              handleClose={() => handleClose}
            />
          )}

          {coordinates && (
            <Menu
              id='simple-menu'
              title='options-menu'
              coordinates={coordinates}
              open={Boolean(open)}
              onClose={handleClose}>
              <MenuList>
                <MenuListItem onClick={handleClose}>
                  <div onClick={authenticateUser}>Link To Dropbox</div>
                </MenuListItem>

                {mode.type === 'View' && (
                  <MenuListItem
                    onClick={() => {
                      handleClose()
                      dispatch({
                        type: 'setMode',
                        payload: { type: 'Move', payload: null }
                      })
                    }}>
                    <div>Move Items</div>
                  </MenuListItem>
                )}

                {mode.type === 'Edit' && (
                  <MenuListItem
                    onClick={() => {
                      setDeleting(true)
                    }}>
                    Delete Item
                  </MenuListItem>
                )}
              </MenuList>
            </Menu>
          )}
        </div>
      </div>
    </>
  )
}
