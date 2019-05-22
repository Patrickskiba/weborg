import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'
import DropboxButton from './dropbox'
import DropboxFiles from './dropbox-files'
import FileExplorer from './fileExplorer'

export default () => {
    const [text, setText] = useState('')
    const [fileList, setFileList] = useState([])

    DropboxFiles({ fileList, setFileList })

    return <div>
        <DropboxButton />
        <FileExplorer fileList={fileList}/>
        <hr />
        { parse(text).map((node, idx) => renderNode({ node, idx })) }
    </div>
}


