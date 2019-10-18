import React from 'react'

export default ({ node, parentNode }) => {
  return (
    <>
      <div className='task-row'>
        {node.content.map((task, idx) => {
          return (
            <div className='task-spacing' key={`task${idx}`}>
              <span className='task-label'>{task.type} </span>
              <span>{task.timestamp}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}
