import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { get, keys } from 'idb-keyval'
import styled from 'styled-components'

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
`

export default ({ setText }) => { 
    const [fileList, setFileList] = useState([])
    const [selectedRow, setSelectedRow] = useState(null)

    keys().then(keys => setFileList(keys))

    return fileList.map((file, idx) => { 
        const highlighed = selectedRow == idx
        return <FileEntry highlighed={highlighed} key={idx} onClick={() => {
            getText(file, setText)
            setSelectedRow(idx)
        }}>{file}</FileEntry>
    })
}
