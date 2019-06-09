import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { authenticateUser } from '../utils/dropboxFiles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '5px'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export default ({ sideBarVisible, setSideBarVisible, selectedRow }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={() => setSideBarVisible(!sideBarVisible)} edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {selectedRow}
          </Typography>
          <SettingsIcon color="inherit" onClick={handleClick}/>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>
              <div onClick={authenticateUser}>Link To Dropbox</div>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}


