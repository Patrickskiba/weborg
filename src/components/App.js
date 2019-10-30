import React, { useContext, useState } from 'react'
import { AddMode, EditMode } from './AddEditMode/index'
import FileExplorer from './FileExplorer'
import MoveNode from './MoveNode'
import RenderOrgNodes from './RenderOrgNodes'
import { StoreContext } from './Store'
import BottomBar from './BottomBar/index'

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
  const [fileExplorer, setFileExplorer] = useState(false)

  return (
    <>
      <FileExplorer sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} />
      <MainArea shouldSubmit={shouldSubmit} />
      {fileExplorer && (<div className='file-explorer-container'>
                          <div className='file-explorer-list'></div>
                        </div>)}
      <BottomBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        setShouldSubmit={setShouldSubmit}
      />
    </>
  )
}
