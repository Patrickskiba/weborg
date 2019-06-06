import React, { useState, useEffect, useContext } from 'react'
import { get, keys } from 'idb-keyval'
import styled from 'styled-components'
import { SelectedFileContext } from './App'

const getText = (file, setText) => get(file).then(setText)

const FileEntry = styled.div`
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: #3c3c3c;
    padding-left: 5px;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: ${props => props.highlighed ? "#b1b1b1" : "#dddddd"};
    border-bottom: 1px solid white;
`

export default ({ setText, setSelectedRow, setSideBarVisible }) => { 
  const [fileList, setFileList] = useState([])
  const selectedRow = useContext(SelectedFileContext)

  useEffect(() => { 
    keys().then(keys => setFileList(keys))
  }, [])

  return fileList.map((file, idx) => { 
    const highlighed = selectedRow == file
    return <React.Fragment>
      <FileEntry highlighed={highlighed} key={idx} onClick={() => {
        getText(file, setText)
        setSelectedRow(file)
        setSideBarVisible(false)
      }}>{file}</FileEntry>
  </React.Fragment>
  })
}
