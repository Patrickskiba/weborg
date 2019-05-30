import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { renderNode } from './RenderOrgNodes'
import TextContent from './TextContent'
import Dot from '../icons/Dot'

import styled from 'styled-components'

const headlineFont = '16'

const Row = styled.div`
    display: flex;
    align-items: 'baseline';
    flex-flow: column;
    font-size: ${headlineFont}px;
    line-height: ${headlineFont}px;
`

const RowItems = styled.div`
    display: flex;
    alignItems: 'baseline';
    justify-content: 'flex-start';
`

const SmallColumn = styled.div`
    flex-grow: 0;
`

const LargeColumn = styled.div`
    flex-grow: 2;
`

const DashPlus = styled.div`
    display: block;
    position: absolute;
    right: 5px;
`

const Stars = ({ showChildren }) => <div style={{ marginRight: '5px'}}><Dot size={`${headlineFont}`} outerVisible={!showChildren} /></div>
    const State = ({ state }) => <span style={{ color: state === 'TODO' ? 'red' : 'green', fontWeight: '600' }}> {state} </span>
    const ChildNodes = ({ children, parentNode, setEditNode }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx, setEditNode, parentNode }))

export default ({ node, setEditNode }) => {
    const [showChildren, setShowChildren] = useState(true)
    return <Row level={node.level} data-testid="headline" >
        <RowItems>
            <SmallColumn> 
                <Stars showChildren={showChildren}/>
            </SmallColumn>
            <LargeColumn>
                <div onClick={() => setEditNode(node)}>
                    <State state={node.State} />
                    <TextContent content={node.content} />
                </div>
                <div>
                    { showChildren && <ChildNodes children={node.children} parentNode={node} setEditNode={setEditNode}/> }
                </div>
            </LargeColumn>
            {node.children.length !== 0 && <DashPlus> 
                { showChildren ? <div onClick={() => setShowChildren(!showChildren)}>-</div> :
                        <div onClick={() => setShowChildren(!showChildren)}>+</div> }
                    </DashPlus> }
                </RowItems>
            </Row> 
}

