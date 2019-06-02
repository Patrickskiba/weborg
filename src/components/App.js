import React, { useState, useEffect, createContext } from 'react'
import styled from 'styled-components'
import dropboxFiles from '../utils/dropboxFiles'
import RenderOrgNodes from './RenderOrgNodes'
import DropboxButton from './Dropbox'
import FileExplorer from './FileExplorer'


const Container = styled.div`
    display: flex;
`

const SideBar = styled.div`
    background: #dddddd;
    height: 100vh;
    width: ${props => props.sideBarVisible ? '10%' : '0px'};
    display: ${props => props.sideBarVisible ? 'block' : 'none'};

    @media (max-width: 400px) {
        width: ${props => props.sideBarVisible ? '80%' : '0%'};
        display: ${props => props.sideBarVisible ? 'block' : 'none'};
    }
`
const MainArea = styled.div`
    width: 90%;
    @media (max-width: 400px) {
        width: 20%;
    }
`


export default () => {
    const [text, setText] = useState('')
    const [sideBarVisible, setSideBarVisible] = useState(true)

    useEffect(() => { dropboxFiles() }, [])

    return <Container>
            <SideBar sideBarVisible={sideBarVisible}>
                <DropboxButton />
                <FileExplorer setText={setText}/>
            </SideBar>
            <MainArea>
                <button onClick={() => setSideBarVisible(!sideBarVisible)}>Hide/Show</button>
                <RenderOrgNodes text={text} setText={setText}/>
            </MainArea>
    </Container>
}

