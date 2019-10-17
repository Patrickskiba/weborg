import React, { useContext, useState, useEffect } from 'react'
import TextContent from './TextContent'
import { StoreContext } from './Store'
import { isSelected } from '../utils/node-helpers'

export default ({ node, parentNode }) => {
  const { mode } = useContext(StoreContext)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    setSelected(isSelected({ mode, node }))
  }, [mode])

  return (
    <>
      <div className={`section-row ${selected && 'highlight'}`}>
        <TextContent content={node.content} />
      </div>
      {parentNode &&
        parentNode.children &&
        parentNode.children[parentNode.children.length - 1].index === node.index && (
          <div className='horizontal-rule' />
        )}
    </>
  )
}
