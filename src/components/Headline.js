import React, { useState } from 'react'
import { renderNode } from './RenderOrgNodes'
import TextContent from './TextContent'
import Dot from '../icons/Dot'

import styled from 'styled-components'

const headlineFont = '16'

const Row = styled.div`
  display: flex;
  align-items: 'baseline';
  flex-flow: column;
  font-size: ${headlineFont}px;
  line-height: ${headlineFont}px;
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
  <svg width="16" height="16">
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
  <svg width="16" height="16">
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

const Stars = ({ showChildren }) => (
  <div style={{ marginRight: '5px' }}>
    <Dot size={`${headlineFont}`} outerVisible={!showChildren} />
  </div>
)
const State = ({ state }) => (
  <span
    style={{ color: state === 'TODO' ? 'red' : 'green', fontWeight: '600' }}
  >
    {' '}
    {state}{' '}
  </span>
)
const ChildNodes = ({ children, parentNode, setEditNode }) =>
  children.length !== 0 &&
  children.map((node, idx) =>
    renderNode({ node, idx, setEditNode, parentNode })
  )

export default ({ node, idx, setEditNode }) => {
  const [showChildren, setShowChildren] = useState(true)
  return (
    <Row level={node.level} data-testid="headline">
      <RowItems>
        <SmallColumn onClick={() => setShowChildren(!showChildren)}>
          <Stars showChildren={showChildren} />
        </SmallColumn>
        <LargeColumn>
          <div onClick={() => setEditNode(node)}>
            <State state={node.State} />
            <TextContent content={node.content} />
          </div>
          <div>
            {showChildren && (
              <ChildNodes
                children={node.children}
                idx={idx}
                parentNode={node}
                setEditNode={setEditNode}
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
