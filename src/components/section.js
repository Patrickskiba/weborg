import React from 'react'
import ReactDOM from 'react-dom'
import TextContent from './textContent'
import styled from 'styled-components'

const Container = styled.div`
    margin-left: 2px;
    margin-top: 10px;
    font-size: 14px;
    color: #717171;
    min-width: 275px;
`

export default ({node}) => <Container> 
    <TextContent content={node.content} />
</Container>
