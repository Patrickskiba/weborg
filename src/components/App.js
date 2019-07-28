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

const AddNoteButton = () => {
  const { dispatch } = useContext(StoreContext)
  return (
    <Fab color="primary" aria-label="Add" style={buttonStyles}>
      <AddIcon
        title="Add"
        onClick={() => dispatch({ type: 'setMode', payload: { type: 'Add' } })}
      />
    </Fab>
  )
}

const MainArea = ({ shouldSubmit }) => {
  const { mode } = useContext(StoreContext)
  return (
    <MainAreaContainer>
      {(mode.type === 'View' || mode.type === 'Move') && <RenderOrgNodes />}
      {mode.type === 'Edit' && <EditMode shouldSubmit={shouldSubmit} />}
      {mode.type === 'Add' && <AddMode shouldSubmit={shouldSubmit} />}
      {mode.type === 'View' && <AddNoteButton />}
      {mode.type === 'Move' && <MoveNode />}
    </MainAreaContainer>
  )
}

export default () => {
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const [shouldSubmit, setShouldSubmit] = useState()

  return (
    <StoreProvider>
      <TopBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        setShouldSubmit={setShouldSubmit}
      />
      <CssBaseline />
      <FileExplorer
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
      />
      <MainArea shouldSubmit={shouldSubmit} />
    </StoreProvider>
  )
}
