import React, { useContext } from 'react'
import { StoreContext } from './Store'

import Fab from '@material/react-fab'

export const demoteHeadline = ({ mode, text, dispatch }) => {
  if (mode.type === 'Move' && mode.range) {
    const splitText = text.split('\n')
    const range = mode.range

    if (range.start === 0) return

    const demotedNode = '*' + splitText[range.start]

    dispatch({
      type: 'setText',
      payload: [
        ...splitText.slice(0, range.start),
        demotedNode,
        ...splitText.slice(range.start + 1, splitText.length)
      ].join('\n')
    })
  }
}

export const promoteHeadline = ({ mode, text, dispatch }) => {
  if (mode.type === 'Move' && mode.range) {
    const splitText = text.split('\n')
    const range = mode.range

    if (range.start === 0) return

    if (splitText[range.start][0] === '*' && splitText[range.start][1] === '*') {
      const promoteNode = splitText[range.start].substring(1)

      dispatch({
        type: 'setText',
        payload: [
          ...splitText.slice(0, range.start),
          promoteNode,
          ...splitText.slice(range.start + 1, splitText.length)
        ].join('\n')
      })
    }
  }
}

const findPreviousHeadline = ({ index, text }) => {
  if (text[index][0] === '*') return index
  return findPreviousHeadline({ index: index - 1, text })
}

const findNextHeadline = ({ index, text, range }) => {
  if (text.length - 1 === index) return { start: range.start, end: range.end }

  if (text[index][0] === '*' && text[index + 1][0] === '*') {
    return { start: range.start, end: index }
  }

  if (text[index + 1][0] === '*') return { start: range.start, end: index }

  return findNextHeadline({
    index: index + 1,
    text,
    range: { start: range.start, end: index }
  })
}

export const moveNodeUp = ({ mode, text, dispatch }) => {
  if (mode.type === 'Move' && mode.range) {
    const splitText = text.split('\n')
    const range = mode.range

    if (range.start === 0) return

    const previousHeadlineEnd = findPreviousHeadline({
      index: range.start - 1,
      text: splitText
    })

    const diff = range.start - previousHeadlineEnd

    dispatch({
      type: 'moveNode',
      payload: {
        text: [
          ...splitText.slice(0, previousHeadlineEnd),
          ...splitText.slice(range.start, range.end + 1),
          ...splitText.slice(previousHeadlineEnd, previousHeadlineEnd + diff),
          ...splitText.slice(range.end + 1, splitText.length)
        ].join('\n'),

        mode: {
          type: 'Move',
          range: {
            start: range.start - diff,
            end: range.end - diff
          }
        }
      }
    })
  }
}

export const moveNodeDown = ({ mode, text, dispatch }) => {
  if (mode.type === 'Move' && mode.range) {
    const splitText = text.split('\n')
    const range = mode.range

    if (range.end === splitText.length - 1) return

    const nextHeadline = findNextHeadline({
      index: range.end + 1,
      text: splitText,
      range: { start: range.end + 1, end: range.end + 1 }
    })

    const diff = nextHeadline.end - range.end

    dispatch({
      type: 'moveNode',
      payload: {
        text: [
          ...splitText.slice(0, range.start),
          ...splitText.slice(nextHeadline.start, nextHeadline.end + 1),
          ...splitText.slice(range.start, nextHeadline.start),
          ...splitText.slice(nextHeadline.end + 1, splitText.length)
        ].join('\n'),
        mode: {
          type: 'Move',
          range: {
            start: range.start + diff,
            end: range.end + diff
          }
        }
      }
    })
  }
}

export default () => {
  const { text, mode, dispatch } = useContext(StoreContext)

  return (
    <div className='movemode-container'>
      <div className='movemode-button'>
        <Fab
          className='move-note-fab'
          title='promote-note'
          onClick={() => promoteHeadline({ mode, text, dispatch })}
          icon={<i className='material-icons'>arrow_back</i>}
        />
      </div>
      <div className='movemode-button'>
        <Fab
          className='move-note-fab'
          title='promote-note'
          onClick={() => demoteHeadline({ mode, text, dispatch })}
          icon={<i className='material-icons'>arrow_forward</i>}
        />
      </div>
      <div className='movemode-button'>
        <Fab
          className='move-note-fab'
          title='promote-note'
          onClick={() => moveNodeUp({ mode, text, dispatch })}
          icon={<i className='material-icons'>arrow_upward</i>}
        />
      </div>
      <div className='movemode-button'>
        <Fab
          className='move-note-fab'
          title='promote-note'
          onClick={() => moveNodeDown({ mode, text, dispatch })}
          icon={<i className='material-icons'>arrow_downward</i>}
        />
      </div>
    </div>
  )
}
