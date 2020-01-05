import React from 'react'

const toggleCheckbox = ({ val, idx, fileText, dispatch }) => {
  const splitText = fileText.split('\n')
  const toggled =
    val === '[ ]' ? splitText[idx].replace('[ ]', '[X]') : splitText[idx].replace('[X]', '[ ]')
  dispatch({
    type: 'setText',
    payload: [
      ...splitText.slice(0, idx),
      toggled,
      ...splitText.slice(idx + 1, splitText.length)
    ].join('\n')
  })
}

export default ({ content, fileText, dispatch }) =>
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
          onClick={() => toggleCheckbox({ val: text.text, idx: text.index, fileText, dispatch })}
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
