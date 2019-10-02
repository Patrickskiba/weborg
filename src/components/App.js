import CssBaseline from '@material-ui/core/CssBaseline'
import React, { useContext, useState } from 'react'
import AddMode from './AddMode'
import EditMode from './EditMode'
import FileExplorer from './FileExplorer'
import MoveNode from './MoveNode'
import RenderOrgNodes from './RenderOrgNodes'
import { StoreContext } from './Store'
import TopBar from './TopBar'

const MainArea = ({ shouldSubmit }) => {
  const { mode } = useContext(StoreContext)
  return (
    <div className='app-container'>
      {(mode.type === 'View' || mode.type === 'Move') && <RenderOrgNodes />}
      {mode.type === 'Edit' && <EditMode shouldSubmit={shouldSubmit} />}
      {mode.type === 'Add' && <AddMode shouldSubmit={shouldSubmit} />}
      {mode.type === 'Move' && <MoveNode />}
    </div>
  )
}

export default () => {
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const [shouldSubmit, setShouldSubmit] = useState()

  return (
    <>
      <CssBaseline />
      <FileExplorer sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} />
      <MainArea shouldSubmit={shouldSubmit} />
      <TopBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        setShouldSubmit={setShouldSubmit}
      />
    </>
  )
}
