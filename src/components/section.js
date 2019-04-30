import React from 'react'
import ReactDOM from 'react-dom'

const ContentText = ({ content }) => content.map((text,idx) => <span key={idx}>{text.text}</span>)

export default ({node}) => <div> 
    <ContentText content={node.content} />
</div>
