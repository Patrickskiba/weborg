import React, { useContext, useState, useEffect } from 'react'
import TextContent from './TextContent'
import { StoreContext } from './Store'
import { getRange, isSelected } from '../utils/node-helpers'
import ContexualOptions from './ContextualOptions'

export default ({ node, parentNode }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    setSelected(isSelected({ mode, node }))
  }, [mode])

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
        <div className={`section-row ${selected && 'highlight'}`}>
          <TextContent content={node.content} />
        </div>
      </ContexualOptions>
      {parentNode &&
        parentNode.children &&
        parentNode.children[parentNode.children.length - 1].index === node.index && (
          <div style={{ width: '100%', borderBottom: '1px solid #eee' }} />
        )}
    </>
  )
}
