import React from 'react'
import ReactDOM from 'react-dom'
import parse from '../parser/index'
import renderNode from '../utils/renderNode'


export default ({ text }) =>  parse(text).map((node, idx) => renderNode({ node, idx }))
