import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'
import TextContent from './textContent'
import Dot from '../icons/dot'

import styled from 'styled-components'

const Row = styled.div`
    display: flex;
    align-items: 'baseline';
    flex-flow: column;
`

const RowItems = styled.div`
    display: flex;
    alignItems: 'baseline';
`

const Stars = () => <div><Dot size={.75}/></div>
const State = ({ state }) => <span style={{marginLeft: '1rem'}} >{state} </span>
const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))
const Elipses = ({ show }) => show ? <span>...</span> : <span></span>

export default ({node}) => {
    const [showChildren, setShowChildren] = useState(true)
    return <Row>
        <RowItems>
            <Stars />
            <div onClick={() => setShowChildren(!showChildren)}>
                <State state={node.State} />
                <TextContent content={node.content} />
            </div>
        </RowItems>
        <Elipses show={!showChildren} />
        { showChildren && <ChildNodes children={node.children} /> }
    </Row> 
}

