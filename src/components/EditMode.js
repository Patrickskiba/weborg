import React from 'react'
import ReactDOM from 'react-dom'

export default ({ editNode, setEditNode }) => <div>
    <button onClick={() => setEditNode()}>Clickith me</button>
    {JSON.stringify(editNode)}
    <div>{editNode.level}</div>
    <div>{editNode.content.map(content => content.text)}</div>
    <div>{editNode.children
            .filter(x => x.type === 'section')
            .map((x, idx) => <div key={idx}> {x.content.map(x => x.text)} </div>)}</div>
    </div>
