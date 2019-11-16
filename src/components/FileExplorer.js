import React, { useContext, useState, useEffect } from 'react'
import { get, keys } from 'idb-keyval'
import { useFormInput } from '../utils/custom-hooks'
import { saveChanges, deleteFile } from '../utils/file-helpers'
import { StoreContext } from './Store'
import dropboxFiles from '../utils/dropbox-files'
import welcome from '../utils/welcome-file'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import TextField from '@material-ui/core/TextField'
import ElevatedTray from './ElevatedTray'

export const getText = (file, dispatch) =>
  get(file).then(text => dispatch({ type: 'setText', payload: text }))

const AddFile = ({ fileList, setFileList }) => {
  const [open, setOpen] = useState(false)
  const newFilename = useFormInput('')

  return (
    <>
      <div className='file-explorer-create white' onClick={() => setOpen(true)}>
        <i className='material-icons file-explorer-icon'>add</i>
        Create new file
      </div>
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
              setFileList([...fileList, newName])
            }}
            color='primary'
            autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const DeleteFile = ({ fileList, setFileList, selectedRow, dispatch }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <i className='material-icons file-explorer-icon' onClick={() => setOpen(true)}>
        delete
      </i>
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
    </>
  )
}

const EditFile = ({ fileList, setFileList, selectedRow, dispatch }) => {
  const newFilename = useFormInput(selectedRow)
  const [open, setOpen] = useState(false)
  return (
    <>
      <i className='material-icons file-explorer-icon' onClick={() => setOpen(true)}>
        edit
      </i>
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
    </>
  )
}

export default ({ sideBarVisible, setSideBarVisible }) => {
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
    <ElevatedTray
      show={sideBarVisible}
      setShow={setSideBarVisible}
      height={fileList.length > 5 ? 'tall' : 'short'}
      footer={<AddFile fileList={fileList} setFileList={setFileList} />}>
      {fileList.sort((a,b) => a.trim().toLowerCase().localeCompare(b.trim().toLowerCase())).map(file => {
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
              <EditFile
                fileList={fileList}
                setFileList={setFileList}
                selectedRow={file}
                dispatch={dispatch}
              />
              <DeleteFile
                fileList={fileList}
                setFileList={setFileList}
                selectedRow={file}
                dispatch={dispatch}
              />
            </div>
          </div>
        )
      })}
    </ElevatedTray>
  )
}
