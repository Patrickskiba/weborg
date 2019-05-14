import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'
import TextContent from './textContent'
import Dot from '../icons/dot'

import styled from 'styled-components'

const headlineFont = '16'

const Row = styled.div`
    display: flex;
    align-items: 'baseline';
    flex-flow: column;
    font-size: ${headlineFont}px;
    line-height: ${headlineFont}px;
    margin-left: 12px;
`

const RowItems = styled.div`
    display: flex;
    alignItems: 'baseline';
`

const TextContentContainer = styled.span`
    margin-left: 12px;
`

const Stars = ({ showChildren }) => <div><Dot size={`${headlineFont}`} outerVisible={!showChildren} /></div>
const State = ({ state }) => <span> {state} </span>
const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))
const Elipses = ({ show }) => show ? <span>...</span> : <span></span>

export default ({node}) => {
    const [showChildren, setShowChildren] = useState(true)
    return <Row level={node.level}>
        <RowItems>
            <Stars showChildren={showChildren}/>
            <div onClick={() => setShowChildren(!showChildren)}>
                <State state={node.State} />
                <TextContentContainer>
                    <TextContent content={node.content} />
                </TextContentContainer>
            </div>
        </RowItems>
        { showChildren && <ChildNodes children={node.children} /> }
    </Row> 
}

