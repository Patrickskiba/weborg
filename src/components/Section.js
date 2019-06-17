import React from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'
import { getRange, highLight } from '../utils/node-helpers'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node, parentNode, mode, clickHandler }) => {
  return (
    <Container
      style={{ color: highLight({ mode, node, normalColor: '#717171' }) }}
      onClick={() => {
        clickHandler({ payload: parentNode, range: getRange(parentNode) })
      }}
    >
      <TextContent content={node.content} />
    </Container>
  )
}
