import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get, keys, set, del } from 'idb-keyval'
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

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: '80vw',
    position: 'absolute',
  },
}))

const useFormInput = initialValue => {
  const [value, setVal] = useState(initialValue)

  const onChange = e => setVal(e.target.value)

  return { value, onChange }
}

const getText = (file, setText) => get(file).then(setText)

const AddFile = ({ fileList, setFileList }) => {
  const [open, setOpen] = useState(false)
  const newFilename = useFormInput('')

  return (
    <div>
      <InsertDriveFile onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'New Filename?'}</DialogTitle>
        <DialogContent>
          <TextField id="new-filename-text" margin="normal" {...newFilename} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              set(newFilename.value, '')
              setOpen(false)
              setFileList([...fileList, newFilename.value].sort())
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

const DeleteFile = ({ fileList, setFileList, selectedRow, setSelectedRow }) => {
  const [open, setOpen] = useState(false)
  const newFilename = useFormInput('')

  return (
    <div>
      <Delete onClick={() => setOpen(true)} />
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
              del(selectedRow)
              setOpen(false)
              const newFileList = fileList
                .filter(entry => entry !== selectedRow)
                .sort()
              setFileList(newFileList)
              setSelectedRow(newFileList[0])
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

const Files = ({
  fileList,
  selectedRow,
  setText,
  setSelectedRow,
  setSideBarVisible,
}) =>
  fileList.map(file => {
    const highlighed = selectedRow == file
    return (
      <ListItem
        button
        key={file}
        onClick={() => {
          getText(file, setText)
          setSelectedRow(file)
          setSideBarVisible(false)
        }}
      >
        <ListItemText style={{ color: highlighed ? '#2196f3' : '#3c3c3c' }}>
          {file}
        </ListItemText>
      </ListItem>
    )
  })

export const FileExplorer = ({
  fileList,
  setFileList,
  setText,
  selectedRow,
  setSelectedRow,
  sideBarVisible,
  setSideBarVisible,
}) => {
  const classes = useStyles()

  useEffect(() => {
    const effect = async () => {
      const storedKeys = await keys()
      if (storedKeys.length !== 0) setFileList(storedKeys)
    }
    effect()
  }, [])

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
          setSelectedRow={setSelectedRow}
        />
        <div>
          <Create />
        </div>
      </div>
      <List>
        <Files
          fileList={fileList}
          selectedRow={selectedRow}
          setText={setText}
          setSelectedRow={setSelectedRow}
          setSideBarVisible={setSideBarVisible}
        />
      </List>
    </Drawer>
  )
}
