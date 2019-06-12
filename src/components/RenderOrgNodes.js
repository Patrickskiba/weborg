import React from 'react'
import parse from '../parser/index'
import Headline from './Headline'
import Section from './Section'

export const renderNode = ({ node, idx, setMode, parentNode }) => {
  if (node.type === 'headline')
    return <Headline node={node} key={idx} setMode={setMode} />
  if (node.type === 'section')
    return (
      <Section
        node={node}
        key={idx}
        setMode={setMode}
        parentNode={parentNode}
      />
    )
}

export default ({ text, setMode }) => (
  <div>
    {parse(text).map((node, idx) => renderNode({ node, idx, setMode }))}
  </div>
)
