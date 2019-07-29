import React, { useState, useReducer } from 'react'
import welcome from '../utils/welcome-file'

const StoreContext = React.createContext()

const initialState = {
  text: welcome.text,
  selectedRow: welcome.fileName,
  mode: {
    type: 'View',
    payload: null,
  },
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setText':
      return { ...state, text: action.payload }
    case 'setSelectedRow':
      return { ...state, selectedRow: action.payload }
    case 'setMode':
      return { ...state, mode: action.payload }
    case 'moveNode':
      return { ...state, mode: action.payload.mode, text: action.payload.text }
    default:
      throw new Error()
  }
}

const StoreProvider = ({ children, initState = initialState }) => {
  const [state, dispatch] = useReducer(reducer, initState)

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreProvider, StoreContext }
