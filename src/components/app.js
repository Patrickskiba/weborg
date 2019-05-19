import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'
import { Dropbox } from 'dropbox'
import DropboxButton from './dropbox'
import DropboxFiles from './dropbox-files'

const initDropbox = () => {
    const hashValue = window.location.hash
    if(hashValue === "") return false
    return new Dropbox({ accessToken: hashValue.substring(1).split('&')[0].replace('access_token=','')})
}

export default () => {
    const [text, setText] = useState('')
    const client = initDropbox()
    return <div>
        <DropboxButton />
        { client && <DropboxFiles client={client} setText={setText}/> }
        <hr />
        { parse(text).map((node, idx) => renderNode({ node, idx })) }
    </div>
}


