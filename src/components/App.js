import React, { useState, useContext } from 'react'
import { StoreProvider, StoreContext } from './Store'
import styled from 'styled-components'
import RenderOrgNodes from './RenderOrgNodes'
import FileExplorer from './FileExplorer'
import TopBar from './TopBar'
import Fab from '@material-ui/core/Fab'
import CssBaseline from '@material-ui/core/CssBaseline'
import AddIcon from '@material-ui/icons/Add'
import EditMode from './EditMode'
import AddMode from './AddMode'
import MoveNode from './MoveNode'
import welcome from '../utils/welcome-file'

const MainAreaContainer = styled.div`
  width: 100%;
  margin-top: 62px;
  margin-bottom: 100px;
`

const buttonStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px',
}

const MainArea = ({ shouldSubmit, selectedRow }) => {
  const { mode, setMode } = useContext(StoreContext)
  return (
    <MainAreaContainer>
      {(mode.type === 'View' || mode.type === 'Move') && <RenderOrgNodes />}
      {mode.type === 'Edit' && (
        <EditMode shouldSubmit={shouldSubmit} selectedRow={selectedRow} />
      )}
      {mode.type === 'Add' && (
        <AddMode shouldSubmit={shouldSubmit} selectedRow={selectedRow} />
      )}
      {mode.type === 'View' && (
        <Fab color="primary" aria-label="Add" style={buttonStyles}>
          <AddIcon title="Add" onClick={() => setMode({ type: 'Add' })} />
        </Fab>
      )}
      {mode.type === 'Move' && <MoveNode />}
    </MainAreaContainer>
  )
}

export default () => {
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const [selectedRow, setSelectedRow] = useState(welcome.fileName)
  const [shouldSubmit, setShouldSubmit] = useState()

  return (
    <StoreProvider>
      <TopBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        selectedRow={selectedRow}
        setShouldSubmit={setShouldSubmit}
      />
      <CssBaseline />
      <FileExplorer
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
      />
      <MainArea shouldSubmit={shouldSubmit} selectedRow={selectedRow} />
    </StoreProvider>
  )
}
