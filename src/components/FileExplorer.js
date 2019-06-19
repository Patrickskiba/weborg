import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get, keys } from 'idb-keyval'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Create from '@material-ui/icons/CreateOutlined'
import Delete from '@material-ui/icons/DeleteOutlined'
import InsertDriveFile from '@material-ui/icons/InsertDriveFileOutlined'

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: '80vw',
    position: 'absolute',
  },
}))

const getText = (file, setText) => get(file).then(setText)

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
        <div>
          <InsertDriveFile />
        </div>
        <div>
          <Delete />
        </div>
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
