import React, { useState } from 'react'
import styled from 'styled-components'
import RenderOrgNodes from './RenderOrgNodes'
import FileExplorer from './FileExplorer'
import TopBar from './TopBar'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import EditMode from './EditMode'

const Container = styled.div`
  display: flex;
`

const SideBar = styled.div`
  background: white;
  height: 100vh;
  width: ${props => (props.sideBarVisible ? '10%' : '0px')};
  display: ${props => (props.sideBarVisible ? 'block' : 'none')};

  @media (max-width: 800px) {
    width: ${props => (props.sideBarVisible ? '20%' : '0%')};
    display: ${props => (props.sideBarVisible ? 'block' : 'none')};
  }

  @media (max-width: 400px) {
    width: ${props => (props.sideBarVisible ? '100%' : '0%')};
    display: ${props => (props.sideBarVisible ? 'block' : 'none')};
  }
`
const MainArea = styled.div`
  width: 100%;
  margin-bottom: 100px;

  @media (max-width: 400px) {
    display: ${props => (props.sideBarVisible ? 'none' : 'block')};
  }
`
const buttonStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px',
}

export const SelectedFileContext = React.createContext('')

export default () => {
  const [text, setText] = useState('')
  const [sideBarVisible, setSideBarVisible] = useState(true)
  const [selectedRow, setSelectedRow] = useState(null)
  const [editNode, setEditNode] = useState()
  const [shouldSubmit, setShouldSubmit] = useState()

  return (
    <div>
      <TopBar
        sideBarVisible={sideBarVisible}
        setSideBarVisible={setSideBarVisible}
        selectedRow={selectedRow}
        editNode={editNode}
        setShouldSubmit={setShouldSubmit}
      />
      <Container>
        <SelectedFileContext.Provider value={selectedRow}>
          <SideBar sideBarVisible={sideBarVisible}>
            <FileExplorer
              setText={setText}
              setSelectedRow={setSelectedRow}
              setSideBarVisible={setSideBarVisible}
            />
          </SideBar>
          <MainArea sideBarVisible={sideBarVisible}>
            <RenderOrgNodes
              text={text}
              setText={setText}
              editNode={editNode}
              setEditNode={setEditNode}
            />
            <EditMode
              editNode={editNode}
              setEditNode={setEditNode}
              text={text}
              setText={setText}
              shouldSubmit={shouldSubmit}
            />
            <Fab color="primary" aria-label="Add" style={buttonStyles}>
              <AddIcon />
            </Fab>
          </MainArea>
        </SelectedFileContext.Provider>
      </Container>
    </div>
  )
}
