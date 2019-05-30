import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import TextContent from './TextContent'

const Container = styled.div`
    margin-left: 2px;
    margin-top: 10px;
    font-size: 14px;
    color: #717171;
    min-width: 275px;
`

export default ({node, setEditNode, parentNode}) => <Container onClick={() => setEditNode(parentNode)}> 
    <TextContent content={node.content} />
</Container>
