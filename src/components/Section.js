import React, { useContext } from 'react'
import styled from 'styled-components'
import TextContent from './TextContent'
import { StoreContext } from './Store'
import { getRange, highLight } from '../utils/node-helpers'
import ContexualOptions from './ContextualOptions'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node, parentNode }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)

  const contexualOptions = {
    editItem: () => {
      dispatch({
        type: 'setMode',
        payload: { type: 'Edit', payload: parentNode }
      })
    },
    moveItem: () =>
      dispatch({
        type: 'setMode',
        payload: {
          type: 'Move',
          payload: parentNode,
          range: getRange(parentNode)
        }
      }),
    deleteNodeProps: {
      editNode: parentNode,
      text,
      dispatch,
      selectedRow
    }
  }

  return (
    <ContexualOptions {...contexualOptions} mode={mode}>
      <Container
        style={{ color: highLight({ mode, node, normalColor: '#717171' }) }}
      >
        <TextContent content={node.content} />
      </Container>
    </ContexualOptions>
  )
}
