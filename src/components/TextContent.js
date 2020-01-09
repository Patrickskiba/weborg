import React from 'react'
import { toggleCheckbox } from '../utils/progress-indicator-helpers'

export default ({ content, parentNode, fileText, selectedRow, dispatch }) =>
  content.map((text, idx) => {
    if (text.type === 'text') {
      return (
        <span key={idx}>
          <span>{text.text}</span>{' '}
        </span>
      )
    }
    if (text.type === 'list') {
      return (
        <span key={idx}>
          <span>{'\u00A0'.repeat(text.whitespace)}</span>
          <span>{text.text}</span>
        </span>
      )
    }

    if (text.type === 'checkbox') {
      return (
        <span
          key={idx}
          onClick={() =>
            toggleCheckbox({
              checkbox: text.text,
              lineNumber: text.index,
              fileText,
              parentNode,
              selectedRow,
              dispatch
            })
          }
          className='text-checkbox'>
          {text.text || ''}
        </span>
      )
    }

    if (text.type === 'progress') {
      return (
        <span key={idx} className='text-checkbox'>
          {text.text || ''}
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
            href={text.href ? text.href : text.text}
            onClick={event => {
              event.stopPropagation()
              event.preventDefault()
              return false
            }}>
            {text.displayText ? text.displayText : text.text}
          </a>{' '}
        </span>
      )
    }
  })
