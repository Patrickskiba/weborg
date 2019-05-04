import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'
import TextContent from './textContent'
import Dot from '../icons/dot'

const Stars = () => <span><Dot size={.5} /></span>
const State = ({ state }) => <span style={{marginLeft: '1rem'}} >{state} </span>
const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))
const Elipses = ({ show }) => show ? <span>...</span> : <span></span>

    export default ({node}) => {
        const [showChildren, setShowChildren] = useState(true)
        return <div >
            <span style={{position: 'relative'}} onClick={() => setShowChildren(!showChildren)}>
                <Stars />
                <State state={node.State} />
                <TextContent content={node.content} />
            </span>
            <Elipses show={!showChildren} />
            { showChildren && <ChildNodes children={node.children} /> }
        </div> 
    }

