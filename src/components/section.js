import React from 'react'
import ReactDOM from 'react-dom'
import TextContent from './textContent'
import styled from 'styled-components'

const Container = styled.div`
    margin-top: 10px;
    font-size: 14px;
    color: #717171;
`

export default ({node}) => <Container> 
    <TextContent content={node.content} />
</Container>
