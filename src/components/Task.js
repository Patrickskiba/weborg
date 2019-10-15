import React, { useContext } from 'react'
import ContexualOptions from './ContextualOptions'
import { StoreContext } from './Store'
import { getRange } from '../utils/node-helpers'

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
    <>
      <ContexualOptions {...contexualOptions} mode={mode}>
        <div className='task-row'>
          {node.content.map((task, idx) => {
            return (
              <div className='task-spacing' key={`task${idx}`}>
                <span className='task-label'>{task.type} </span>
                <span>{task.timestamp}</span>
              </div>
            )
          })}
        </div>
      </ContexualOptions>
      {parentNode &&
        parentNode.children &&
        parentNode.children[parentNode.children.length - 1].index === node.index && (
          <div className='horizontal-rule' />
        )}
    </>
  )
}
