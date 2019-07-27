import React, { useContext } from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'
import { StoreContext } from './Store'
import { getRange, highLight } from '../utils/node-helpers'
import { LongPress } from './LongPress'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node, parentNode }) => {
  const { mode, setMode } = useContext(StoreContext)

  const SectionLongPress = {
    short: () => {
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
    },
    long: () =>
      mode.type !== 'Move'
        ? setMode({
            type: 'Move',
            payload: parentNode,
            range: getRange(parentNode),
          })
        : {},
  }

  return (
    <LongPress {...SectionLongPress} onClick={SectionLongPress.short}>
      <Container
        style={{ color: highLight({ mode, node, normalColor: '#717171' }) }}
      >
        <TextContent content={node.content} />
      </Container>
    </LongPress>
  )
}
