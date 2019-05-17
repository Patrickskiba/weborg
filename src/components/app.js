import React from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'
import DropboxButton from './dropbox'


export default ({ text }) => <div>
    <DropboxButton />
    { parse(text).map((node, idx) => renderNode({ node, idx })) }
</div>


