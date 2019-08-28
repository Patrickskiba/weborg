import React, { useContext } from 'react'
import styled from 'styled-components'
import ContexualOptions from './ContextualOptions'
import { StoreContext } from './Store'
import { getRange } from '../utils/node-helpers'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

const TaskContainer = styled.span`
  margin-right: 0.5rem;
`

const TaskType = styled.span`
  color: #4a4a4a;
  font-weight: 500;
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
      <Container>
        {node.content.map((task, idx) => {
          return (
            <TaskContainer key={`task${idx}`}>
              <TaskType>{task.type} </TaskType>
              <span>{task.timestamp}</span>
            </TaskContainer>
          )
        })}
      </Container>
    </ContexualOptions>
  )
}
