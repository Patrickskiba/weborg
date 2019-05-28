import React from 'react'
import ReactDOM from 'react-dom'
import Headline from '../components/Headline'
import Section from '../components/Section'

export default ({ node, idx }) => {
    if(node.type === 'headline') return <Headline node={node} key={idx} />
    if(node.type === 'section') return <Section node={node} key={idx} />
}
