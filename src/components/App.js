import React, { useContext, useState } from 'react'
import { AddMode, EditMode } from './AddEditMode'
import FileExplorer from './FileExplorer'
import MoveNode from './MoveNode'
import RenderOrgNodes from './RenderOrgNodes'
import { StoreContext } from './Store'
import BottomBar from './BottomBar'

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
      <FileExplorer sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} />
      <MainArea shouldSubmit={shouldSubmit} />
      <BottomBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        setShouldSubmit={setShouldSubmit}
      />
    </>
  )
}
