import React, { useContext } from 'react'
import { StoreContext } from './Store'
import parse from '../parser/index'
import Headline from './Headline'
import Section from './Section'

export const renderNode = ({
  node,
  idx,
  parentNode,
  mode,
  setMode,
  clickHandler,
}) => {
  if (node.type === 'headline')
    return (
      <Headline
        node={node}
        key={idx}
        mode={mode}
        setMode={setMode}
        clickHandler={clickHandler}
      />
    )
  if (node.type === 'section')
    return (
      <Section
        node={node}
        key={idx}
        parentNode={parentNode}
        mode={mode}
        clickHandler={clickHandler}
      />
    )
}

export default ({ mode, setMode, clickHandler }) => {
  const { text } = useContext(StoreContext)
  return (
    <div>
      {parse(text).map((node, idx) =>
        renderNode({ node, idx, mode, setMode, clickHandler })
      )}
    </div>
  )
}
