import React, { useState, useContext } from 'react'
import { renderNode } from './RenderOrgNodes'
import TextContent from './TextContent'
import Dot from '../icons/Dot'
import { getRange, highLight, isSelected } from '../utils/node-helpers'
import { useLongPress } from '../utils/custom-hooks'
import { StoreContext } from './Store'

import styled from 'styled-components'

const headlineFont = '16'

const Row = styled.div`
  display: flex;
  align-items: 'baseline';
  flex-flow: column;
  font-size: ${headlineFont}px;
  line-height: ${headlineFont}px;
  padding-top: 5px;
  padding-bottom: 5px;
`

const RowItems = styled.div`
  display: flex;
  alignitems: 'baseline';
  justify-content: 'flex-start';
`

const SmallColumn = styled.div``

const LargeColumn = styled.div`
  min-width: 40%;
  overflow-wrap: break-word;
  margin-right: 8px;
`

const DashPlus = styled.div`
  display: block;
  position: absolute;
  right: 1px;
  font-size: 16px;
`

const Dash = () => (
  <svg title="dash-collapse" width="16" height="16">
    {' '}
    <line
      x1="8"
      y1="8"
      x2="16"
      y2="8"
      style={{ stroke: 'black', strokeWidth: 1.5 }}
    />{' '}
  </svg>
)

const Plus = () => (
  <svg title="plus-expand" width="16" height="16">
    <line
      x1="8"
      y1="8"
      x2="16"
      y2="8"
      style={{ stroke: 'black', strokeWidth: 1.5 }}
    />
    <line
      x1="12"
      y1="4"
      x2="12"
      y2="12"
      style={{ stroke: 'black', strokeWidth: 1.5 }}
    />
  </svg>
)

const Stars = ({ showChildren, selected }) => {
  if (selected) {
    return (
      <div style={{ marginRight: '5px' }}>
        <Dot
          size={`${headlineFont}`}
          outerVisible={!showChildren}
          fill={'brown'}
        />
      </div>
    )
  }

  return (
    <div style={{ marginRight: '5px' }}>
      <Dot size={`${headlineFont}`} outerVisible={!showChildren} />
    </div>
  )
}

const State = ({ state }) => {
  const textStyle = {
    color: state === 'TODO' ? 'red' : 'green',
    fontWeight: '600',
  }
  return <span style={textStyle}> {state} </span>
}

const Priority = ({ priority }) => {
  const textStyle = {
    fontWeight: 'bold',
  }
  return <span style={textStyle}> #[{priority}] </span>
}

const ChildNodes = ({ children, parentNode, mode, setMode, clickHandler }) =>
  children.length !== 0 &&
  children.map((node, idx) =>
    renderNode({ node, idx, parentNode, mode, setMode, clickHandler })
  )

export default ({ node, idx }) => {
  const { mode, setMode } = useContext(StoreContext)
  const [showChildren, setShowChildren] = useState(true)

  const headlineLongPress = useLongPress({
    long: () =>
      mode.type !== 'Move'
        ? setMode({ type: 'Move', payload: node, range: getRange(node) })
        : {},
  })

  const clickHandler = () => {
    if (mode.type === 'View') {
      setMode({ type: 'Edit', payload: node })
    }
    if (mode.type === 'Move') {
      setMode({
        type: 'Move',
        payload: node,
        range: getRange(node),
      })
    }
  }

  return (
    <Row
      level={node.level}
      data-testid="headline"
      style={{ color: highLight({ node, mode, normalColor: 'black' }) }}
      {...headlineLongPress}
    >
      <RowItems>
        <SmallColumn onClick={() => setShowChildren(!showChildren)}>
          <Stars
            showChildren={showChildren}
            selected={isSelected({ mode, node })}
          />
        </SmallColumn>
        <LargeColumn>
          <div onClick={clickHandler}>
            {node.State && <State state={node.State} />}
            {node.priority && <Priority priority={node.priority} />}
            <TextContent content={node.content} />
          </div>
          <div>
            {showChildren && (
              <ChildNodes
                children={node.children}
                idx={idx}
                parentNode={node}
                mode={mode}
                setMode={setMode}
                clickHandler={clickHandler}
              />
            )}
          </div>
        </LargeColumn>
        {node.children.length !== 0 && (
          <DashPlus onClick={() => setShowChildren(!showChildren)}>
            {showChildren ? <Dash /> : <Plus />}
          </DashPlus>
        )}
      </RowItems>
    </Row>
  )
}
