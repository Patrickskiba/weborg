import React from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'
import DropboxButton from './dropbox'
import DropboxFiles from './dropbox-files'


export default ({ text }) => <div>
    <DropboxButton />
    <DropboxFiles />
    <hr />
    { parse(text).map((node, idx) => renderNode({ node, idx })) }
</div>


