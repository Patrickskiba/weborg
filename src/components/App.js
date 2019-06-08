import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dropboxFiles from '../utils/dropboxFiles'
import RenderOrgNodes from './RenderOrgNodes'
import FileExplorer from './FileExplorer'
import TopBar from './TopBar'


const Container = styled.div`
    display: flex;
`

const SideBar = styled.div`
    background: #dddddd;
    height: 100vh;
    width: ${props => props.sideBarVisible ? '10%' : '0px'};
    display: ${props => props.sideBarVisible ? 'block' : 'none'};

    @media (max-width: 800px) {
        width: ${props => props.sideBarVisible ? '20%' : '0%'};
        display: ${props => props.sideBarVisible ? 'block' : 'none'};
    }

    @media (max-width: 400px) {
        width: ${props => props.sideBarVisible ? '100%' : '0%'};
        display: ${props => props.sideBarVisible ? 'block' : 'none'};
    }
`
const MainArea = styled.div`
    width: 100%;

    @media (max-width: 400px) {
        display: ${props => props.sideBarVisible ? 'none' : 'block'};
    }
`

const MenuBar = styled.div`
    background-color: white;
    padding: 0.2rem;
    width: 100%;
    height: 1.5rem;
    border-bottom: 1px solid #f1eeee;
`

export const SelectedFileContext = React.createContext('')

export default () => {
  const [text, setText] = useState('')
  const [sideBarVisible, setSideBarVisible] = useState(true)
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => { dropboxFiles() }, [])

    return <div>
      <TopBar sideBarVisible={sideBarVisible} setSideBarVisible={setSideBarVisible} selectedRow={selectedRow}></TopBar>
      <Container>
        <SelectedFileContext.Provider value={selectedRow}> 
          <SideBar sideBarVisible={sideBarVisible}>
            <FileExplorer setText={setText} setSelectedRow={setSelectedRow} setSideBarVisible={setSideBarVisible}/>
          </SideBar>
          <MainArea sideBarVisible={sideBarVisible}>
            <RenderOrgNodes text={text} setText={setText}/>
          </MainArea>
        </SelectedFileContext.Provider>
      </Container>
    </div>
}

