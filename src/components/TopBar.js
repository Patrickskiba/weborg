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
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { authenticateUser } from '../utils/dropbox-files'
import { get } from 'idb-keyval'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '5px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginRight: '5px',
  },
}))

const DeleteItemDialog = ({ clickHandler, handleClose, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      <MenuItem onClick={() => setOpen(true)}>
        <div>{children}</div>
      </MenuItem>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete This Item?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you intend to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions onClick={handleClose}>
          <Button
            onClick={() => {
              handleClose()
              setOpen(false)
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={clickHandler} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default ({
  sideBarVisible,
  setSideBarVisible,
  selectedRow,
  mode,
  setMode,
  setShouldSubmit,
}) => {
  const { text, setText } = useContext(StoreContext)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClose = () => setAnchorEl(null)

  const handleClick = event => setAnchorEl(event.currentTarget)

  const classes = useStyles()

  useEffect(() => {
    setShouldSubmit()
  })

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            title="toggle-file-explorer"
            onClick={() => setSideBarVisible(!sideBarVisible)}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            data-testid="filename-titlebar"
            variant="h6"
            className={classes.title}
          >
            {selectedRow}
          </Typography>
          {(mode.type === 'Add' || mode.type === 'Edit') && (
            <React.Fragment>
              <Check
                style={{ marginRight: '1rem' }}
                color="inherit"
                title="save"
                onClick={() => setShouldSubmit('SaveChanges')}
              />
              <Close
                style={{ marginRight: '1rem' }}
                color="inherit"
                title="cancel"
                onClick={() => setShouldSubmit('CancelChanges')}
              />
            </React.Fragment>
          )}

          {mode.type === 'Move' && (
            <React.Fragment>
              <Check
                style={{ marginRight: '1rem' }}
                title="move-mode-save"
                color="inherit"
                onClick={() => {
                  saveChanges({ selectedRow, newText: text })
                  setMode({ type: 'View' })
                }}
              />
              <Close
                style={{ marginRight: '1rem' }}
                title="move-mode-cancel"
                color="inherit"
                onClick={() => {
                  get(selectedRow).then(text => setText(text))
                  setMode({ type: 'View' })
                }}
              />
            </React.Fragment>
          )}
          <SettingsIcon
            title="SettingsIcon"
            color="inherit"
            onClick={handleClick}
          />
          <Menu
            id="simple-menu"
            title="options-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <div onClick={authenticateUser}>Link To Dropbox</div>
            </MenuItem>

            {mode.type === 'View' && (
              <MenuItem
                onClick={() => {
                  handleClose()
                  setMode({ type: 'Move' })
                }}
              >
                <div>Move Items</div>
              </MenuItem>
            )}

            {mode.type === 'Edit' && (
              <DeleteItemDialog
                handleClose={handleClose}
                clickHandler={() => setShouldSubmit('Delete')}
              >
                Delete Item
              </DeleteItemDialog>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}
