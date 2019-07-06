import React, { useEffect, useState } from 'react'
import { get, keys, del } from 'idb-keyval'
import { useFormInput } from '../utils/custom-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { saveChanges } from '../utils/file-helpers'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Create from '@material-ui/icons/CreateOutlined'
import Delete from '@material-ui/icons/DeleteOutlined'
import InsertDriveFile from '@material-ui/icons/InsertDriveFileOutlined'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogContentText from '@material-ui/core/DialogContentText'

const useStyles = makeStyles(() => ({
  paper: {
    maxWidth: '80vw',
    position: 'absolute',
  },
  highlighedText: {
    color: '#2196f3',
  },
  normalText: {
    color: '#3c3c3c',
  },
}))

const getText = (file, setText) => get(file).then(setText)

const AddFile = ({ fileList, setFileList }) => {
  const [open, setOpen] = useState(false)
  const newFilename = useFormInput('')

  return (
    <div>
      <InsertDriveFile title="add-file" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Create a new file?'}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="new-filename-text"
            label="New Filename"
            margin="normal"
            {...newFilename}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newName = `${newFilename.value}.org`
              saveChanges({ selectedRow: newName, newText: '' })
              setOpen(false)
              setFileList([...fileList, newName].sort())
            }}
            color="primary"
            autoFocus
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const DeleteFile = ({
  fileList,
  setFileList,
  selectedRow,
  setSelectedRow,
  setText,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Delete title="delete-file" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete File?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-delete-file-description">
            Are you sure you intend to delete the file: <br />
            <strong>{selectedRow}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newFileList = fileList
                .filter(entry => entry !== selectedRow)
                .sort()
              del(selectedRow)
              setFileList(newFileList)
              setSelectedRow(newFileList[0])
              getText(newFileList[0], setText)
              setOpen(false)
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const EditFile = ({ fileList, setFileList, selectedRow, setSelectedRow }) => {
  const [open, setOpen] = useState(false)
  const newFilename = useFormInput(selectedRow)

  return (
    <div>
      <Create title="edit-file" onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to edit the filename?'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="New Filename"
            id="new-filename-text"
            margin="normal"
            {...newFilename}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newName = `${newFilename.value.replace('.org', '')}.org`
              get(selectedRow).then(storedText => {
                setOpen(false)
                saveChanges({ selectedRow: newName, newText: storedText })
                del(selectedRow)
                setSelectedRow(newName)
                setFileList(
                  fileList.map(entry =>
                    entry === selectedRow ? newName : entry
                  )
                )
              })
            }}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const Files = ({
  fileList,
  selectedRow,
  setText,
  setSelectedRow,
  setSideBarVisible,
  setMode,
  classes,
}) => {
  return fileList.map(file => {
    const highlighed = selectedRow == file
    return (
      <ListItem
        button
        key={file}
        onClick={() => {
          getText(file, setText)
          setSelectedRow(file)
          setSideBarVisible(false)
          setMode({ type: 'View' })
        }}
      >
        <ListItemText
          classes={{
            primary: highlighed ? classes.highlighedText : classes.normalText,
          }}
        >
          {file}
        </ListItemText>
      </ListItem>
    )
  })
}

export default ({
  fileList,
  setFileList,
  setText,
  selectedRow,
  setSelectedRow,
  sideBarVisible,
  setSideBarVisible,
  setMode,
}) => {
  const classes = useStyles()

  return (
    <Drawer
      classes={{ paper: classes.paper }}
      open={sideBarVisible}
      onClose={() => setSideBarVisible(false)}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          padding: '5px',
          backgroundColor: '#dddddd',
        }}
      >
        <AddFile fileList={fileList} setFileList={setFileList} />
        <DeleteFile
          fileList={fileList}
          setFileList={setFileList}
          selectedRow={selectedRow}
          setText={setText}
          setSelectedRow={setSelectedRow}
        />
        <EditFile
          fileList={fileList}
          setFileList={setFileList}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </div>
      <List>
        <Files
          fileList={fileList}
          selectedRow={selectedRow}
          setText={setText}
          setSelectedRow={setSelectedRow}
          setSideBarVisible={setSideBarVisible}
          setMode={setMode}
          classes={classes}
        />
      </List>
    </Drawer>
  )
}
