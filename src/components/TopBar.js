import React, { useEffect, useState } from 'react'
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
import { authenticateUser } from '../utils/dropboxFiles'

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
  },
}))

const DeleteItemAlertDialog = ({ clickHandler, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <React.Fragment>
      <div onClick={() => setOpen(true)}>{children}</div>
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
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
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
  setShouldSubmit,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const classes = useStyles()

  useEffect(() => {
    setShouldSubmit()
  })

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <IconButton
            onClick={() => setSideBarVisible(!sideBarVisible)}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {selectedRow}
          </Typography>
          {(mode.type === 'Add' || mode.type === 'Edit') && (
            <React.Fragment>
              <Check
                style={{ marginRight: '1rem' }}
                color="inherit"
                onClick={() => setShouldSubmit('SaveChanges')}
              />
              <Close
                style={{ marginRight: '1rem' }}
                color="inherit"
                onClick={() => setShouldSubmit('CancelChanges')}
              />
            </React.Fragment>
          )}
          <SettingsIcon color="inherit" onClick={handleClick} />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <div onClick={authenticateUser}>Link To Dropbox</div>
            </MenuItem>

            {mode.type === 'Edit' && (
              <MenuItem onClick={handleClose}>
                <DeleteItemAlertDialog
                  clickHandler={() => setShouldSubmit('Delete')}
                >
                  Delete Item
                </DeleteItemAlertDialog>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}
