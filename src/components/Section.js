import React, { useContext } from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'
import { StoreContext } from './Store'
import { getRange, highLight } from '../utils/node-helpers'
import LongPress from './LongPress'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node, parentNode }) => {
  const { mode, dispatch } = useContext(StoreContext)

  const SectionLongPress = {
    short: () => {
      if (mode.type === 'View') {
        dispatch({
          type: 'setMode',
          payload: { type: 'Edit', payload: parentNode },
        })
      }
      if (mode.type === 'Move') {
        dispatch({
          type: 'setMode',
          payload: {
            type: 'Move',
            payload: parentNode,
            range: getRange(parentNode),
          },
        })
      }
    },
    long: () =>
      mode.type !== 'Move'
        ? dispatch({
            type: 'setMode',
            payload: {
              type: 'Move',
              payload: parentNode,
              range: getRange(parentNode),
            },
          })
        : {},
  }

  return (
    <LongPress {...SectionLongPress}>
      <Container
        style={{ color: highLight({ mode, node, normalColor: '#717171' }) }}
      >
        <TextContent content={node.content} />
      </Container>
    </LongPress>
  )
}
