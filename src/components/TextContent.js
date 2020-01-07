import React from 'react'

const traverseUp = (i, parent) => {
  const hasProgress = parent.children[i].content.find(child => child.type === 'progress')
  if (hasProgress) {
    return parent.children[i].content
  }

  if (!hasProgress && i > 0) {
    return traverseUp(i - 1, parent)
  }

  return false
}

const findProgressIndicator = (idx, parentNode) => {
  let currentIdx = parentNode.children.findIndex(child => child.index === idx)

  if (currentIdx > 0) {
    return traverseUp(currentIdx - 1, parentNode)
  }
}

const traverseDown = ({ i, whitespace, parent, numerator, demonitor }) => {
  if (i < parent.children.length) {
    if (whitespace >= parent.children[i].content[0].whitespace) return { numerator, demonitor }

    const hasCheckbox = parent.children[i].content.find(child => child.type === 'checkbox')
    if (hasCheckbox) {
      if (hasCheckbox.text === '[ ]') {
        return traverseDown({ i: i + 1, whitespace, parent, numerator, demonitor: demonitor + 1 })
      }
      if (hasCheckbox.text === '[X]') {
        return traverseDown({
          i: i + 1,
          whitespace,
          parent,
          numerator: numerator + 1,
          demonitor: demonitor + 1
        })
      }
    }
    return traverseDown({ i: i + 1, whitespace, parent, numerator, demonitor })
  }
  return { numerator, demonitor }
}

const incrementProgressIndicator = (progIndicator, parentNode) => {
  let currentIdx = parentNode.children.findIndex(child => child.index === progIndicator[0].index)
  return {
    idx: progIndicator[0].index,
    ...traverseDown({
      i: currentIdx + 1,
      whitespace: progIndicator[0].whitespace,
      parent: parentNode,
      numerator: 0,
      demonitor: 0
    })
  }
}

const toggleCheckbox = ({ val, idx, fileText, parentNode, dispatch }) => {
  const hasProgressIndicator = findProgressIndicator(idx, parentNode)
  if (hasProgressIndicator) {
    const progIndicator = incrementProgressIndicator(hasProgressIndicator, parentNode)
    if (val === '[ ]') {
      progIndicator.numerator += 1
    }
    if (val === '[X]') {
      progIndicator.numerator -= 1
    }

    console.log(progIndicator)
  }
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

export default ({ content, parentNode, fileText, dispatch }) =>
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
            toggleCheckbox({ val: text.text, idx: text.index, fileText, parentNode, dispatch })
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
