import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'
import DropboxButton from './dropbox'
import DropboxFiles from './dropbox-files'
import FileExplorer from './fileExplorer'
import Database from '../utils/database'

export default () => {
    const [text, setText] = useState('')
    const [client, setClient] = useState(undefined)

    DropboxFiles(client, setClient)

    return <div>
        <DropboxButton />
        <FileExplorer setText={setText}/>
        <hr />
        { parse(text).map((node, idx) => renderNode({ node, idx })) }
    </div>
}


