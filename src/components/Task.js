import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-left: 2px;
  margin-top: 10px;
  font-size: 14px;
  color: #717171;
  min-width: 275px;
`

export default ({ node }) => {
  return (
    <Container>
      {node.content.map((task, idx) => {
        return (
          <React.Fragment key={`task${idx}`}>
            <span>{task.type}</span>
            <span>{task.timestamp}</span>
          </React.Fragment>
        )
      })}
    </Container>
  )
}
