import React from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'
import TextContent from './textContent'

const Stars = ({ level }) => <span>{'*'.repeat(level)} </span>
const State = ({ state }) => <span>{state} </span>
const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))

export default ({node}) => <div>
    <Stars level={node.level} />
    <State state={node.State} />
    <TextContent content={node.content} />
    <ChildNodes children={node.children} />
</div> 

