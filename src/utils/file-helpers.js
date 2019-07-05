import { set } from 'idb-keyval'
import { saveFile } from './dropbox-files'

export const saveChanges = ({ selectedRow, newText }) => {
  set(selectedRow, newText)
  saveFile({ file: selectedRow, newText })
}
