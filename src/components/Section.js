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
  console.log(mode)
  if (mode && mode.payload && mode.payload.index === node.index) {
    return 'grey'
  }
  return 'white'
}

export default ({ node, parentNode, mode, clickHandler }) => {
  return (
    <Container
      style={{ backgroundColor: highLight(mode, parentNode) }}
      onClick={() => {
        clickHandler({ payload: parentNode })
      }}
    >
      <TextContent content={node.content} />
    </Container>
  )
}
