import React, { useState } from 'react'
import styled from 'styled-components'
import parse from '../parser/index'
import ReactDOM from 'react-dom'
import Headline from '../components/Headline'
import Section from '../components/Section'

const ReadArea = styled.div`
    display: ${props => props.editing ? 'none' : 'block'}
`

const EditArea = styled.div`
    display: ${props => props.editing ? 'block' : 'none'}
`


export const renderNode = ({ node, idx, setEditNode, parentNode }) => {
    if(node.type === 'headline') return <Headline node={node} key={idx} setEditNode={setEditNode}/>
    if(node.type === 'section') return <Section node={node} key={idx} setEditNode={setEditNode} parentNode={parentNode}/>
}

export default ({ text }) => {
    const [editNode, setEditNode] = useState()

    return <React.Fragment>
        <ReadArea editing={editNode}>{parse(text).map((node, idx) => renderNode({ node, idx, setEditNode }))}</ReadArea>
        <EditArea editing={editNode}>
            <button onClick={() => setEditNode()}>Clickith me</button>
            {JSON.stringify(editNode)}
            <div>{editNode && editNode.children
                    .filter(x => x.type === 'section')
                    .map(x => <div> {x.content.map(x => x.text)} </div>)}</div>
        </EditArea>
    </React.Fragment>
}

