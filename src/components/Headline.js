import React, { useState, useContext, useEffect } from 'react'
import TextContent from './TextContent'
import ContexualOptions from './ContextualOptions'
import { renderNode } from './RenderOrgNodes'
import { getRange, isSelected } from '../utils/node-helpers'
import { StoreContext } from './Store'

const Stars = ({ showChildren, children }) => {
  if (!children.length) {
    return (
      <svg height='20' width='20'>
        <line x1='5' y1='10' x2='15' y2='10' strokeWidth='2' stroke='black' />
      </svg>
    )
  }
  if (showChildren) {
    return <i className='material-icons headline-star'>chevron_right</i>
  }

  return <i className='material-icons headline-star'>expand_more</i>
}

export const State = ({ state }) => (
  <span className={`headline-state-text ${state === 'TODO' ? 'red' : 'green'}`}> {state} </span>
)

const Priority = ({ priority }) => <span className='headline-priority-text'> #[{priority}] </span>

const ChildNodes = ({ children, parentNode }) =>
  children.length !== 0 &&
  children.map((node, idx) => {
    if (
      node.type !== 'headline' &&
      (children[idx + 1] === undefined || children[idx + 1].type === 'headline')
    ) {
      return (
        <React.Fragment key={idx}>
          {renderNode({ node, idx, parentNode })}
          <div className='horizontal-rule' />
        </React.Fragment>
      )
    }
    return <React.Fragment key={idx}>{renderNode({ node, idx, parentNode })}</React.Fragment>
  })

const useShowChildren = (showDefault, children) => {
  const [showChildren, setShowChildren] = useState(showDefault)

  const setShowChildrenIfHasChildren = state =>
    children && children.length ? setShowChildren(state) : false

  return [showChildren, setShowChildrenIfHasChildren]
}

export default ({ node, idx }) => {
  const { text, mode, selectedRow, dispatch } = useContext(StoreContext)
  const [showChildren, setShowChildren] = useShowChildren(true, node.children)

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
      <div level={node.level} data-testid='headline' className='headline-row'>
        <div className='headline-row-item'>
          <div onClick={() => setShowChildren(!showChildren)}>
            <Stars showChildren={showChildren} children={node.children} />
          </div>
          <div className='headline-content'>
            <div
              className={`headline-text ${selected ? 'highlight' : ''}`}
              onClick={() => setShowChildren(!showChildren)}>
              {node.State && <State state={node.State} />}
              {node.priority && <Priority priority={node.priority} />}
              <TextContent content={node.content} />
              {!showChildren && <span>...</span>}
            </div>
            <div>
              {node.children.length !== 0 &&
                node.children[0].type === 'headline' &&
                showChildren && <div className='horizontal-rule' />}
              {showChildren && (
                <ChildNodes children={node.children} idx={idx} parentNode={node} mode={mode} />
              )}
            </div>
          </div>
          <div className='headline-dashplus'>
            <ContexualOptions {...contexualOptions} mode={mode}>
              <i className='material-icons headline-star'>more_vert</i>
            </ContexualOptions>
          </div>
        </div>
      </div>
      {!node.children.length && <div className='horizontal-rule' />}
      {!showChildren && <div className='horizontal-rule' />}
    </>
  )
}
