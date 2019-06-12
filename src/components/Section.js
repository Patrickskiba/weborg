import React from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node, setMode, parentNode }) => (
  <Container onClick={() => setMode({ type: 'Edit', payload: parentNode })}>
    <TextContent content={node.content} />
  </Container>
)
