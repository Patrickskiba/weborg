import React, { useEffect, useState, useContext } from 'react'
import { StoreContext } from './Store'
import { saveChanges } from '../utils/file-helpers'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/MoreVert'
import MenuIcon from '@material-ui/icons/Menu'
import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'
import DeleteNode from './DeleteNode'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { authenticateUser } from '../utils/dropbox-files'
import { get } from 'idb-keyval'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '5px'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginRight: '5px'
  },
  appBar: {
    top: 'auto',
    bottom: 0
  }
}))

const AddNoteButton = () => {
  const useStyles = makeStyles(theme => ({
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto'
    }
  }))
  const { dispatch } = useContext(StoreContext)
  const classes = useStyles()
  return (
    <Fab color='primary' aria-label='Add' className={classes.fabButton}>
      <AddIcon
        title='Add'
        onClick={() => dispatch({ type: 'setMode', payload: { type: 'Add' } })}
      />
    </Fab>
  )
}

export default ({ sideBarVisible, setSideBarVisible, setShouldSubmit }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = event => setAnchorEl(event.currentTarget)

  const classes = useStyles()

  useEffect(() => {
    setShouldSubmit()
  })

  return (
    <div className={classes.root}>
      <AppBar position='fixed' color='primary' className={classes.appBar}>
        <Toolbar>
          <IconButton
            title='toggle-file-explorer'
            onClick={() => setSideBarVisible(!sideBarVisible)}
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='Menu'>
            <MenuIcon />
          </IconButton>
          <Typography data-testid='filename-titlebar' variant='h6' className={classes.title}>
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

          <AddNoteButton />
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
        </Toolbar>
      </AppBar>
    </div>
  )
}
