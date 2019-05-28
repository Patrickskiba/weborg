import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import renderNode from '../utils/renderNode'
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

const TEST = styled.div`
    margin-top: 10px;
    background-color:#000;
    width:1px;
`

const RowItems = styled.div`
    display: flex;
    alignItems: 'baseline';
    justify-content: 'flex-start';
`

const SmallColumn = styled.div`
    flex-grow: 0;
`

const Test = styled.div`
    background: grey;
    box-shadow: 0px 0px 0px 0px grey;
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
const ChildNodes = ({ children }) => children.length !== 0 &&  children.map((node, idx) => renderNode({ node, idx }))
const Elipses = ({ show }) => show ? <span>...</span> : <span></span>

export default ({node}) => {
    const [showChildren, setShowChildren] = useState(true)
    return <Row level={node.level} data-testid="headline" >
        <RowItems>
            <Test/>
            <SmallColumn> 
                <Stars showChildren={showChildren}/>
            </SmallColumn>
            <LargeColumn>
                <div>
                    <State state={node.State} />
                        <TextContent content={node.content} />
                        { showChildren && <ChildNodes children={node.children} /> }
                </div>
            </LargeColumn>
            {node.children.length !== 0 && <DashPlus> 
                { showChildren ? <div onClick={() => setShowChildren(!showChildren)}>-</div> :
                        <div onClick={() => setShowChildren(!showChildren)}>+</div> }
                    </DashPlus> }
                </RowItems>
            </Row> 
}

