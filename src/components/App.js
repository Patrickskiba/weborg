import React, { useContext, useState } from 'react'
import { AddMode, EditMode } from './AddEditMode/index'
import FileExplorer from './FileExplorer'
import MoveNode from './MoveNode'
import RenderOrgNodes from './RenderOrgNodes'
import { StoreContext } from './Store'
import BottomBar, { AgendaBottomBar } from './BottomBar/index'
import Agenda from './Agenda/index'

const MainArea = ({ sideBarVisible, setSideBarVisible, shouldSubmit, setShouldSubmit }) => {
  const { mode } = useContext(StoreContext)
  return (
    <div className='app-container'>
      {(mode.type === 'View' || mode.type === 'Move') && (
        <>
          <RenderOrgNodes />
          <BottomBar
            sideBarVisible={sideBarVisible}
            setSideBarVisible={setSideBarVisible}
            setShouldSubmit={setShouldSubmit}
          />
        </>
      )}
      {mode.type === 'Edit' && (
        <>
          <EditMode shouldSubmit={shouldSubmit} />
          <BottomBar
            sideBarVisible={sideBarVisible}
            setSideBarVisible={setSideBarVisible}
            setShouldSubmit={setShouldSubmit}
          />
        </>
      )}
      {mode.type === 'Add' && (
        <>
          <AddMode shouldSubmit={shouldSubmit} />
          <BottomBar
            sideBarVisible={sideBarVisible}
            setSideBarVisible={setSideBarVisible}
            setShouldSubmit={setShouldSubmit}
          />
        </>
      )}
      {mode.type === 'Move' && (
        <>
          <MoveNode />
          <BottomBar
            sideBarVisible={sideBarVisible}
            setSideBarVisible={setSideBarVisible}
            setShouldSubmit={setShouldSubmit}
          />
        </>
      )}
      {mode.type === 'Agenda' && (
        <>
          <Agenda />
          <AgendaBottomBar
            sideBarVisible={sideBarVisible}
            setSideBarVisible={setSideBarVisible}
            setShouldSubmit={setShouldSubmit}
          />
        </>
      )}
    </div>
  )
}

export default () => {
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const [shouldSubmit, setShouldSubmit] = useState(false)

  return (
    <>
      <FileExplorer sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} />
      <MainArea
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        shouldSubmit={shouldSubmit}
        setShouldSubmit={setShouldSubmit}
      />
    </>
  )
}
