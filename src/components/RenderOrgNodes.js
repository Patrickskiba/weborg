import React, { useContext } from 'react'
import { StoreContext } from './Store'
import parse from '../parser/index'
import Headline from './Headline'
import Task from './Task'
import Section from './Section'

export const renderNode = ({ node, idx, parentNode }) => {
  if (node.type === 'headline') {
    return <Headline node={node} key={idx} />
  }
  if (node.type === 'task') {
    return <Task node={node} parentNode={parentNode} key={idx} />
  }
  if (node.type === 'section') {
    return <Section node={node} key={idx} parentNode={parentNode} />
  }
}

export default () => {
  const { text } = useContext(StoreContext)
  return <div>{parse(text).map((node, idx) => renderNode({ node, idx }))}</div>
}
