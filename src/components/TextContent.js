import React from 'react'

export default ({ content }) =>
  content.map((text, idx) => {
    if (text.type === 'text') {
      return (
        <span key={idx}>
          <span>{text.text}</span>{' '}
        </span>
      )
    }
    if (text.type === 'bold') {
      return (
        <span key={idx}>
          <span className='text-bold'>{text.text.substring(1, text.text.length - 1)}</span>{' '}
        </span>
      )
    }
    if (text.type === 'italic') {
      return (
        <span key={idx}>
          <span className='text-italic'>{text.text.substring(1, text.text.length - 1)}</span>{' '}
        </span>
      )
    }
    if (text.type === 'underline') {
      return (
        <span key={idx}>
          <span className='text-underline'>{text.text.substring(1, text.text.length - 1)}</span>{' '}
        </span>
      )
    }
    if (text.type === 'strikethrough') {
      return (
        <span key={idx}>
          <span className='text-strikethrough'>{text.text.substring(1, text.text.length - 1)}</span>{' '}
        </span>
      )
    }
    if (text.type === 'url') {
      return (
        <span key={idx}>
          <a
            href={text.text}
            onClick={event => {
              event.stopPropagation()
              event.preventDefault()
              return false
            }}>
            {text.text}
          </a>{' '}
        </span>
      )
    }
  })
