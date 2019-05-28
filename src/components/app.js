import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'
import DropboxButton from './dropbox'
import DropboxFiles from './dropbox-files'
import FileExplorer from './fileExplorer'
import Database from '../utils/database'


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

const ReadArea = styled.div`
    display: ${props => props.editing ? 'none' : 'block'}
`

const EditArea = styled.div`
    display: ${props => props.editing ? 'block' : 'none'}
`


export default () => {
    const [text, setText] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [sideBarVisible, setSideBarVisible] = useState(true)

    useEffect(() => { DropboxFiles() }, [])

    return <Container>
        <SideBar sideBarVisible={sideBarVisible}>
            <DropboxButton />
            <FileExplorer setText={setText}/>
        </SideBar>
        <MainArea>
            <button onClick={() => setSideBarVisible(!sideBarVisible)}>Hide/Show</button>
            <ReadArea editing={editMode}>{ parse(text).map((node, idx) => renderNode({ node, idx })) }</ReadArea>
            <EditArea editing={editMode}></EditArea>
        </MainArea>
    </Container>
}


