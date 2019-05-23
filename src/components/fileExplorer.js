import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { get, keys } from 'idb-keyval'

const getText = (file, setText) => get(file).then(setText)


export default ({ setText }) => { 
    const [fileList, setFileList] = useState([])

    keys().then(keys => setFileList(keys))

    return fileList.map((file, idx) => <div key={idx} onClick={() => getText(file, setText)}>{file}</div>)
}
