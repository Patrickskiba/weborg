import React from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'

const Stars = ({ level }) => <span>{'*'.repeat(level)} </span>
const HeadlineText = ({ content }) => content.map((text,idx) => <span key={idx}>{text.text}</span>)
const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))

export default ({node}) => <div>
    <Stars level={node.level} />
    <HeadlineText content={node.content} />
    <ChildNodes children={node.children} />
</div> 

