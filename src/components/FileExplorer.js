import React, { useContext, useState, useEffect } from 'react'
import { get, keys } from 'idb-keyval'
import { useFormInput } from '../utils/custom-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { saveChanges, deleteFile } from '../utils/file-helpers'
import { StoreContext } from './Store'
import dropboxFiles from '../utils/dropbox-files'
import welcome from '../utils/welcome-file'
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
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles(() => ({
  paper: {
    maxWidth: '75vw',
    position: 'absolute'
  },
  highlighedText: {
    color: '#2196f3'
  },
  normalText: {
    color: '#3c3c3c'
  }
}))

const getText = (file, dispatch) =>
  get(file).then(text => dispatch({ type: 'setText', payload: text }))

const AddFile = ({ fileList, setFileList }) => {
  const [open, setOpen] = useState(false)
  const newFilename = useFormInput('')

  return (
    <div>
      <InsertDriveFile title='add-file' onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'Create a new file?'}</DialogTitle>
        <DialogContent>
          <TextField id='new-filename-text' label='New Filename' margin='normal' {...newFilename} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newName = `${newFilename.value}.org`
              saveChanges({ selectedRow: newName, newText: '' })
              setOpen(false)
              setFileList([...fileList, newName].sort())
            }}
            color='primary'
            autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const DeleteFile = ({ fileList, setFileList, selectedRow, dispatch }) => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Delete title='delete-file' onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{'Delete File?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-delete-file-description'>
            Are you sure you intend to delete the file: <br />
            <strong>{selectedRow}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newFileList = fileList.filter(entry => entry !== selectedRow).sort()
              deleteFile({ selectedRow })
              setFileList(newFileList)
              dispatch({ type: 'setSelectedRow', payload: newFileList[0] })
              getText(newFileList[0], dispatch)
              setOpen(false)
            }}
            color='primary'
            autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const EditFile = ({ fileList, setFileList, selectedRow, dispatch }) => {
  const EditModal = ({ fileList, setFileList, selectedRow, dispatch }) => {
    const newFilename = useFormInput(selectedRow)
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>
          {'Are you sure you want to edit the filename?'}
        </DialogTitle>
        <DialogContent>
          <TextField label='New Filename' id='new-filename-text' margin='normal' {...newFilename} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newName = `${newFilename.value.replace('.org', '')}.org`
              get(selectedRow).then(storedText => {
                setOpen(false)
                saveChanges({ selectedRow: newName, newText: storedText })
                deleteFile({ selectedRow })
                dispatch({ type: 'setSelectedRow', payload: newName })
                setFileList(fileList.map(entry => (entry === selectedRow ? newName : entry)))
              })
            }}
            color='primary'
            autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const [open, setOpen] = useState(false)

  return (
    <div>
      <Create title='edit-file' onClick={() => setOpen(true)} />
      {open && (
        <EditModal
          fileList={fileList}
          setFileList={setFileList}
          selectedRow={selectedRow}
          dispatch={dispatch}
        />
      )}
    </div>
  )
}

const Files = ({ fileList, selectedRow, dispatch, classes }) => {
  return fileList.map(file => {
    const highlighed = selectedRow == file
    return (
      <ListItem
        button
        key={file}
        onClick={() => {
          dispatch({ type: 'setSelectedRow', payload: file })
          getText(file, dispatch)
        }}>
        <ListItemText
          classes={{
            primary: highlighed ? classes.highlighedText : classes.normalText
          }}>
          {file}
        </ListItemText>
      </ListItem>
    )
  })
}

export default ({ sideBarVisible, setSideBarVisible }) => {
  const [fileList, setFileList] = useState([welcome.fileName])
  const { selectedRow, dispatch } = useContext(StoreContext)

  const classes = useStyles()

  useEffect(() => {
    const effect = async () => {
      await dropboxFiles()
      setFileList([...(await keys()).filter(entry => entry.includes('.org'))])
    }
    effect()
  }, [])

  return (
    <Drawer
      classes={{ paper: classes.paper }}
      open={sideBarVisible}
      onClose={() => setSideBarVisible(false)}>
      <div className='file-container'>
        <AddFile fileList={fileList} setFileList={setFileList} />
        <DeleteFile
          fileList={fileList}
          setFileList={setFileList}
          selectedRow={selectedRow}
          dispatch={dispatch}
        />
        <EditFile
          fileList={fileList}
          setFileList={setFileList}
          selectedRow={selectedRow}
          dispatch={dispatch}
        />
      </div>
      <List>
        <Files
          fileList={fileList}
          selectedRow={selectedRow}
          dispatch={dispatch}
          setSideBarVisible={setSideBarVisible}
          classes={classes}
        />
      </List>
    </Drawer>
  )
}

const inProgress = ({ sideBarVisible, setSideBarVisible }) => {
  const [fileList, setFileList] = useState([welcome.fileName])
  const { selectedRow, dispatch } = useContext(StoreContext)

  useEffect(() => {
    const effect = async () => {
      await dropboxFiles()
      setFileList([...(await keys()).filter(entry => entry.includes('.org'))])
    }
    effect()
  }, [])

  return (
    <>
      {sideBarVisible && (
        <div className='file-explorer-container'>
          <div className='file-explorer-list'>
            <div className='file-explorer-list-container'>
              {fileList.map(file => {
                const highlighted = selectedRow === file
                return (
                  <div className={`file-explorer-item`}>
                    <div
                      className={`${highlighted ? 'selected' : 'white'}`}
                      onClick={() => {
                        dispatch({ type: 'setSelectedRow', payload: file })
                        getText(file, dispatch)
                        setSideBarVisible(false)
                      }}>
                      {file.length > 30 ? `${file.substring(0, 30)}...` : file}
                    </div>
                    <div>
                      <i className='material-icons file-explorer-icon'>edit</i>
                      <i className='material-icons file-explorer-icon'>delete</i>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
