import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import RenderOrgNodes from './RenderOrgNodes'
import { FileExplorer } from './FileExplorer'
import { TopBar } from './TopBar'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import EditMode from './EditMode'
import AddMode from './AddMode'
import MoveNode from './MoveNode'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import dropboxFiles from '../utils/dropbox-files'
import Create from '@material-ui/icons/Create'
import welcome from '../utils/welcome-file'

const Container = styled.div`
  display: flex;
`
const MainArea = styled.div`
  width: 100%;
  margin-bottom: 100px;
`

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: '80vw',
    position: 'absolute',
  },
}))

const buttonStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px',
}

export default () => {
  const [text, setText] = useState(welcome.text)
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(welcome.fileName)
  const [shouldSubmit, setShouldSubmit] = useState()
  const [fileList, setFileList] = useState([welcome.fileName])
  const classes = useStyles()

  const [mode, setMode] = useState({
    type: 'View',
    payload: null,
  })

  useEffect(() => {
    const effect = async () => {
      const fileKeys = await dropboxFiles()
      setFileList(fileKeys)
    }
    effect()
  }, [])

  return (
    <div>
      <TopBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        selectedRow={selectedRow}
        mode={mode}
        setMode={setMode}
        setShouldSubmit={setShouldSubmit}
        text={text}
      />
      <Container>
        <Drawer
          classes={{ paper: classes.paper }}
          open={sideBarVisible}
          onClose={() => setSideBarVisible(false)}
        >
          <List>
            <FileExplorer
              fileList={fileList}
              setFileList={setFileList}
              setText={setText}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              sideBarVisible={sideBarVisible}
              setSideBarVisible={setSideBarVisible}
            />
          </List>
          <Create />
        </Drawer>
        <MainArea sideBarVisible={sideBarVisible}>
          {mode.type === 'View' && (
            <RenderOrgNodes
              text={text}
              clickHandler={({ payload }) => setMode({ type: 'Edit', payload })}
            />
          )}
          {mode.type === 'Move' && (
            <RenderOrgNodes
              text={text}
              mode={mode}
              clickHandler={({ payload, range }) => {
                setMode({
                  type: 'Move',
                  payload,
                  range: range,
                })
              }}
            />
          )}
          {mode.type === 'Edit' && (
            <EditMode
              mode={mode}
              setMode={setMode}
              text={text}
              setText={setText}
              shouldSubmit={shouldSubmit}
              selectedRow={selectedRow}
            />
          )}
          {mode.type === 'Add' && (
            <AddMode
              setMode={setMode}
              text={text}
              setText={setText}
              shouldSubmit={shouldSubmit}
              selectedRow={selectedRow}
            />
          )}
          {mode.type === 'View' && (
            <Fab color="primary" aria-label="Add" style={buttonStyles}>
              <AddIcon onClick={() => setMode({ type: 'Add' })} />
            </Fab>
          )}
          {mode.type === 'Move' && (
            <MoveNode
              mode={mode}
              setMode={setMode}
              text={text}
              setText={setText}
            />
          )}
        </MainArea>
      </Container>
    </div>
  )
}
