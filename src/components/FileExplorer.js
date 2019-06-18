import React, { useEffect } from 'react'
import { get, keys, set } from 'idb-keyval'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const getText = (file, setText) => get(file).then(setText)

export const FileExplorer = ({
  fileList,
  setFileList,
  setText,
  selectedRow,
  setSelectedRow,
  setSideBarVisible,
}) => {
  useEffect(() => {
    const effect = async () => {
      const storedKeys = await keys()
      if (storedKeys.length !== 0) setFileList(storedKeys)
      if (storedKeys.length === 0) {
        set('welcome', '* this is a test')
        setFileList(['welcome'])
      }
    }
    effect()
  }, [])

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
        }}
      >
        <ListItemText style={{ color: highlighed ? '#2196f3' : '#3c3c3c' }}>
          {file}
        </ListItemText>
      </ListItem>
    )
  })
}
