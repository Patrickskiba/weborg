import React, { useState } from 'react'
import styled from 'styled-components'
import parse from '../parser/index'
import Headline from './Headline'
import Section from './Section'
import EditMode from './EditMode'

const ReadArea = styled.div`
    display: ${props => props.editing ? 'none' : 'block'}
`

export const renderNode = ({ node, idx, setEditNode, parentNode }) => {
    if(node.type === 'headline') return <Headline node={node} key={idx} setEditNode={setEditNode}/>
    if(node.type === 'section') return <Section node={node} key={idx} setEditNode={setEditNode} parentNode={parentNode}/>
}

export default ({ text, setText }) => {
    const [editNode, setEditNode] = useState()

    return <React.Fragment>
      <ReadArea editing={editNode}>{parse(text).map((node, idx) => renderNode({ node, idx, setEditNode }))}</ReadArea>
      {editNode && <EditMode editNode={editNode} setEditNode={setEditNode} text={text} setText={setText}/>}
    </React.Fragment>
}

