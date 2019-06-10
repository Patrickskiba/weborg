import React, { useState } from 'react'
import styled from 'styled-components'
import parse from '../parser/index'
import Headline from './Headline'
import Section from './Section'

const ReadArea = styled.div`
  display: ${props => (props.editing ? 'none' : 'block')};
`

export const renderNode = ({ node, idx, setEditNode, parentNode }) => {
  if (node.type === 'headline')
    return <Headline node={node} key={idx} setEditNode={setEditNode} />
  if (node.type === 'section')
    return (
      <Section
        node={node}
        key={idx}
        setEditNode={setEditNode}
        parentNode={parentNode}
      />
    )
}

export default ({ text, setText, editNode, setEditNode }) => (
  <ReadArea editing={editNode}>
    {parse(text).map((node, idx) => renderNode({ node, idx, setEditNode }))}
  </ReadArea>
)
