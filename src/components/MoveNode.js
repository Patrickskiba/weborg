import React from 'react'
import Fab from '@material-ui/core/Fab'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
`

const Button = styled.div`
  margin: 10px;
`

const buttonStyles = {
  position: 'fixed',
  right: '0px',
  bottom: '0px',
}

export const moveNodeUp = ({ mode, setMode, text, setText }) => {
  if (mode.type === 'Move' && mode.range) {
    const splitText = text.split('\n')
    const range = mode.range

    if (range.start === 0) return

    setText(
      [
        ...splitText.slice(0, range.start - 1),
        ...splitText.slice(range.start, range.end + 1),
        splitText[range.start - 1],
        ...splitText.slice(range.end + 1, splitText.length),
      ].join('\n')
    )

    setMode({
      type: 'Move',
      range: {
        start: range.start - 1,
        end: range.end - 1,
      },
    })
  }
}

export const moveNodeDown = ({ mode, setMode, text, setText }) => {
  if (mode.type === 'Move' && mode.range) {
    const splitText = text.split('\n')
    const range = mode.range

    if (range.end === splitText.length - 1) return

    setText(
      [
        ...splitText.slice(0, range.start),
        splitText[range.end + 1],
        ...splitText.slice(range.start, range.end + 1),
        ...splitText.slice(range.end + 2, splitText.length),
      ].join('\n')
    )

    setMode({
      type: 'Move',
      range: {
        start: range.start + 1,
        end: range.end + 1,
      },
    })
  }
}

export default ({ mode, setMode, text, setText }) => (
  <Container style={buttonStyles}>
    <Button>
      <Fab color="primary">
        <ArrowUpward
          color="inherit"
          title="move-note-up"
          onClick={() => moveNodeUp({ mode, setMode, text, setText })}
        />
      </Fab>
    </Button>
    <Button>
      <Fab color="primary">
        <ArrowDownward
          color="inherit"
          title="move-note-down"
          onClick={() => moveNodeDown({ mode, setMode, text, setText })}
        />
      </Fab>
    </Button>
  </Container>
)
