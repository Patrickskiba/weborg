import CssBaseline from '@material-ui/core/CssBaseline'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import AddMode from './AddMode'
import EditMode from './EditMode'
import FileExplorer from './FileExplorer'
import MoveNode from './MoveNode'
import RenderOrgNodes from './RenderOrgNodes'
import { StoreContext } from './Store'
import TopBar from './TopBar'

const MainAreaContainer = styled.div`
  width: 100%;
  margin-top: 62px;
  margin-bottom: 100px;
`

const buttonStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px'
}

const AddNoteButton = () => {
  const { dispatch } = useContext(StoreContext)
  return (
    <Fab color='primary' aria-label='Add' style={buttonStyles}>
      <AddIcon
        title='Add'
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
    <>
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
    </>
  )
}
