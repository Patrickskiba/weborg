import React from 'react'
import ReactDOM from 'react-dom'
import TextContent from './textContent'

export default ({node}) => <div> 
    <TextContent content={node.content} />
</div>
