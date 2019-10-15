import React, { useState, useContext, useEffect } from 'react'
import TextContent from './TextContent'
import ContexualOptions from './ContextualOptions'
import { renderNode } from './RenderOrgNodes'
import { getRange, isSelected } from '../utils/node-helpers'
import { StoreContext } from './Store'

const Stars = ({ showChildren, selected, children }) => {
  if (!children.length) {
    return (
      <svg height='20' width='20'>
        <line x1='5' y1='10' x2='15' y2='10' strokeWidth='2' stroke='black' />
      </svg>
    )
  }
  if (showChildren) {
    return <i className='material-icons headline-star'>expand_more</i>
  }

  return <i className='material-icons headline-star'>expand_less</i>
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
            <Stars
              showChildren={showChildren}
              selected={isSelected({ mode, node })}
              children={node.children}
            />
          </div>
          <div className='headline-content'>
            <ContexualOptions {...contexualOptions} mode={mode}>
              {node.State && <State state={node.State} />}
              {node.priority && <Priority priority={node.priority} />}
              <TextContent content={node.content} />
            </ContexualOptions>
            <div>
              {node.children.length !== 0 && node.children[0].type === 'headline' && (
                <div className='horizontal-rule' />
              )}
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
      {!node.children.length && <div className='horizontal-rule' />}
    </>
  )
}
