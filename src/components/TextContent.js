import React from 'react'
import ReactDOM from 'react-dom'

const bold = { fontWeight: 'bold' }
const italic = { fontStyle: 'italic' }
const underline = { textDecoration: 'underline' }
const strikethrough = { textDecoration: 'line-through' }

export default ({ content }) => content.map((text,idx) => {
        if (text.type === 'text') return <span key={idx}><span>{text.text}</span> </span>
        if (text.type === 'bold') return <span key={idx}><span style={bold}>{text.text.substring(1, text.text.length - 1)}</span> </span>
        if (text.type === 'italic') return <span key={idx}><span style={italic}>{text.text.substring(1, text.text.length - 1)}</span> </span>
        if (text.type === 'underline') return <span key={idx}><span style={underline}>{text.text.substring(1, text.text.length - 1)}</span> </span>
        if (text.type === 'strikethrough') return <span key={idx}><span style={strikethrough}>{text.text.substring(1, text.text.length - 1)}</span> </span>
})
