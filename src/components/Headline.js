import React, { useState, useContext, useEffect } from 'react'
import TextContent from './TextContent'
import Dot from '../icons/Dot'
import ContexualOptions from './ContextualOptions'
import { renderNode } from './RenderOrgNodes'
import { getRange, isSelected } from '../utils/node-helpers'
import { StoreContext } from './Store'

const Stars = ({ showChildren, selected }) => {
  if (selected) {
    return (
      <div className='headline-star'>
        <Dot size='16' outerVisible={!showChildren} fill='brown' />
      </div>
    )
  }

  return (
    <div className='headline-star'>
      <Dot size='16' outerVisible={!showChildren} />
    </div>
  )
}

const State = ({ state }) => (
  <span className={`headline-state-text ${state === 'TODO' ? 'red' : 'green'}`}> {state} </span>
)

const Priority = ({ priority }) => <span className='headline-priority-text'> #[{priority}] </span>

const ChildNodes = ({ children, parentNode }) =>
  children.length !== 0 && children.map((node, idx) => renderNode({ node, idx, parentNode }))

export default ({ node, idx }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)
  const [showChildren, setShowChildren] = useState(true)

  const [selected, setSelected] = useState(false)

  useEffect(() => {
    setSelected(isSelected({ mode, node }))
  }, [mode])

  const contexualOptions = {
    editItem: () => {
      dispatch({ type: 'setMode', payload: { type: 'Edit', payload: node } })
    },
    moveItem: () =>
      dispatch({
        type: 'setMode',
        payload: { type: 'Move', payload: node, range: getRange(node) }
      }),
    deleteNodeProps: {
      editNode: node,
      text,
      dispatch,
      selectedRow
    },
    toggleTodoProps: {
      text,
      node,
      selectedRow,
      dispatch
    }
  }

  return (
    <>
      <div
        level={node.level}
        data-testid='headline'
        className={`headline-row ${selected && 'highlight'}`}>
        <div className='headline-row-item'>
          <div onClick={() => setShowChildren(!showChildren)}>
            <Stars showChildren={showChildren} selected={isSelected({ mode, node })} />
          </div>
          <div className='headline-content'>
            <ContexualOptions {...contexualOptions} mode={mode}>
              {node.State && <State state={node.State} />}
              {node.priority && <Priority priority={node.priority} />}
              <TextContent content={node.content} />
            </ContexualOptions>
            <div>
              {showChildren && (
                <ChildNodes children={node.children} idx={idx} parentNode={node} mode={mode} />
              )}
            </div>
          </div>
          {node.children.length !== 0 && (
            <div className='headline-dashplus' onClick={() => setShowChildren(!showChildren)}>
              {showChildren ? (
                <svg title='dash-collapse' width='16' height='16'>
                  <line x1='8' y1='8' x2='16' y2='8' stroke='black' strokeWidth='1.5' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' title='plus-expand' width='16' height='16'>
                  <line x1='8' y1='8' x2='16' y2='8' stroke='black' strokeWidth='1.5' />
                  <line x1='12' y1='4' x2='12' y2='12' stroke='black' strokeWidth='1.5' />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
      {!node.children.length && <div style={{ width: '100%', borderBottom: '1px solid #eee' }} />}
    </>
  )
}
