import { set, del } from 'idb-keyval'
import { saveFile, removeFile } from './dropbox-files'

export const saveChanges = ({ selectedRow, newText }) => {
  set(selectedRow, newText)
  saveFile({ file: selectedRow, newText })
}

export const deleteFile = ({ selectedRow }) => {
  removeFile({ file: selectedRow })
  del(selectedRow)
}
