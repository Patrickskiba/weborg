import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'
import TextContent from './textContent'

const Stars = ({ level }) => <span>{'*'.repeat(level)} </span>
    const State = ({ state }) => <span>{state} </span>
    const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))
const Elipses = ({ show }) => show ? <span>...</span> : <span></span>

    export default ({node}) => {
        const [showChildren, setShowChildren] = useState(true)
        return <div>
            <span onClick={() => setShowChildren(!showChildren)}>
                <Stars level={node.level} />
                <State state={node.State} />
                <TextContent content={node.content} />
            </span>
            <Elipses show={!showChildren} />
            { showChildren && <ChildNodes children={node.children} /> }
        </div> 
    }

