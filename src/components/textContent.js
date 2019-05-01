import React from 'react'
import ReactDOM from 'react-dom'

const bold = { fontWeight: 'bold' }
const italic = { fontStyle: 'italic' }
const strikethrough = { textDecoraction: 'line-through' }

export default ({ content }) => content.map((text,idx) => {
    if (text.type === 'text') return <span key={idx}>{text.text}</span>
    if (text.type === 'bold') return <span style={bold} key={idx}>{text.text}</span>
    if (text.type === 'italic') return <span style={italic} key={idx}>{text.text}</span>
    if (text.type === 'underline') return <span style={strikethrough} key={idx}>{text.text}</span>
})
