import React, { useContext } from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'
import { StoreContext } from './Store'
import { getRange, highLight } from '../utils/node-helpers'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node, parentNode }) => {
  const { mode, setMode } = useContext(StoreContext)

  const clickHandler = () => {
    if (mode.type === 'View') {
      setMode({ type: 'Edit', payload: parentNode })
    }
    if (mode.type === 'Move') {
      setMode({
        type: 'Move',
        payload: parentNode,
        range: getRange(parentNode),
      })
    }
  }
  return (
    <Container
      style={{ color: highLight({ mode, node, normalColor: '#717171' }) }}
      onClick={clickHandler}
    >
      <TextContent content={node.content} />
    </Container>
  )
}
