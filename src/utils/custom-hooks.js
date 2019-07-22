import { useState, useEffect } from 'react'

export const useFormInput = initialValue => {
  const [value, setVal] = useState(initialValue)

  const onChange = e => setVal(e.target.value)

  return { value, onChange }
}

const doNothing = () => {}

export const useLongPress = ({
  short = doNothing,
  long = doNothing,
  ms = 500,
}) => {
  const [startLongPress, setStartLongPress] = useState(false)
  const [longPressed, setLongPressed] = useState(false)

  let longId

  useEffect(() => {
    if (startLongPress) {
      longId = setTimeout(() => {
        setLongPressed(true)
        long()
      }, ms)
    } else {
      clearTimeout(longId)
    }

    return () => {
      clearTimeout(longId)
    }
  }, [startLongPress])

  useEffect(() => {
    window.addEventListener('scroll', () => clearTimeout(longId))
    return () => {
      window.removeEventListener('scroll', () => clearTimeout(longId))
    }
  })

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => {
      setStartLongPress(false)
      if (longPressed) {
        setLongPressed(false)
      }
      if (!longPressed) {
        short()
      }
    },
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => {
      setStartLongPress(false)
      if (longPressed) {
        setLongPressed(false)
      }
      if (!longPressed) {
        short()
      }
    },
  }
}
