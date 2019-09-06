import CssBaseline from '@material-ui/core/CssBaseline'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import React, { useContext, useState } from 'react'
import AddMode from './AddMode'
import EditMode from './EditMode'
import FileExplorer from './FileExplorer'
import MoveNode from './MoveNode'
import RenderOrgNodes from './RenderOrgNodes'
import { StoreContext } from './Store'
import TopBar from './TopBar'

const AddNoteButton = () => {
  const { dispatch } = useContext(StoreContext)
  return (
    <div className='app-bottom-left'>
      <Fab color='primary' aria-label='Add'>
        <AddIcon
          title='Add'
          onClick={() => dispatch({ type: 'setMode', payload: { type: 'Add' } })}
        />
      </Fab>
    </div>
  )
}

const MainArea = ({ shouldSubmit }) => {
  const { mode } = useContext(StoreContext)
  return (
    <div className='app-container'>
      {(mode.type === 'View' || mode.type === 'Move') && <RenderOrgNodes />}
      {mode.type === 'Edit' && <EditMode shouldSubmit={shouldSubmit} />}
      {mode.type === 'Add' && <AddMode shouldSubmit={shouldSubmit} />}
      {mode.type === 'View' && <AddNoteButton />}
      {mode.type === 'Move' && <MoveNode />}
    </div>
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
      <FileExplorer sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} />
      <MainArea shouldSubmit={shouldSubmit} />
    </>
  )
}
