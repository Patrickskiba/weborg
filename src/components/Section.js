import React, { useState } from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

const highLight = (mode, node) => {
  if (
    mode &&
    mode.range &&
    mode.range &&
    mode.range.start < node.index &&
    mode.range.end >= node.index
  ) {
    return 'brown'
  }
  return '#717171'
}

const filterNonSections = node =>
  node.children.filter(section => section.type === 'section')

const getRange = node => {
  const sectionChildren = filterNonSections(node)
  return {
    start: node.index,
    end: sectionChildren.length ? sectionChildren.pop().index : node.index,
  }
}

export default ({ node, parentNode, mode, clickHandler }) => {
  return (
    <Container
      style={{ color: highLight(mode, node) }}
      onClick={() => {
        clickHandler({ payload: parentNode, range: getRange(parentNode) })
      }}
    >
      <TextContent content={node.content} />
    </Container>
  )
}
