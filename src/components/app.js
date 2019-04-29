import React from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import Headline from './headline'


export default ({ text }) =>  parse(text).map((node, idx) => node.type === 'headline' ? <Headline node={node} key={idx} /> : <div key={idx}/>)
