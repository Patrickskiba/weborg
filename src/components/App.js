import React, { useState } from 'react'
import styled from 'styled-components'
import RenderOrgNodes from './RenderOrgNodes'
import { FileExplorer } from './FileExplorer'
import { TopBar } from './TopBar'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import EditMode from './EditMode'
import AddMode from './AddMode'
import MoveNode from './MoveNode'

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

  @media (max-width: 500px) {
    width: ${props => (props.sideBarVisible ? '100%' : '0%')};
    display: ${props => (props.sideBarVisible ? 'block' : 'none')};
  }
`
const MainArea = styled.div`
  width: 100%;
  margin-bottom: 100px;

  @media (max-width: 500px) {
    display: ${props => (props.sideBarVisible ? 'none' : 'block')};
  }
`
const buttonStyles = {
  position: 'fixed',
  right: '10px',
  bottom: '10px',
}

export default () => {
  const [text, setText] = useState('')
  const [sideBarVisible, setSideBarVisible] = useState(true)
  const [selectedRow, setSelectedRow] = useState(null)
  const [shouldSubmit, setShouldSubmit] = useState()

  const [mode, setMode] = useState({
    type: 'View',
    payload: null,
  })

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
        <SideBar sideBarVisible={sideBarVisible}>
          <FileExplorer
            setText={setText}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            setSideBarVisible={setSideBarVisible}
          />
        </SideBar>
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
